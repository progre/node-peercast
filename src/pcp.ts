import events = require('events');
import http = require('http');
import net = require('net');
import path = require('path');
import stream = require('stream');
import log4js = require('log4js');
import PcpSocket = require('./pcpsocket');

var logger = log4js.getLogger();

export function createServer() {
    return <Server>new ServerImpl();
}

export interface Server extends ServerImpl {
    on(event: 'connection', listener: (socket: PcpSocket) => void): events.EventEmitter;
    on(event: 'request', listener: (req: http.IncomingMessage, res: http.ServerResponse, socket: PcpSocket) => void): events.EventEmitter;
    on(event: 'listening', listener: () => void): events.EventEmitter;
    on(event: string, listener: Function): events.EventEmitter;
}

class ServerImpl extends events.EventEmitter {
    private httpServer = http.createServer();

    constructor() {
        super();

        this.httpServer.on('connection',(socket: net.Socket) => {
            logger.debug('connected: ' + socket.remoteAddress + ':' + socket.remotePort);
            // http.Serverのsocketはreadableイベントを発行しないのでなんとかした
            readablesify(socket);
            socket.on('readable',() => {
                if (!isPcpHeader(<Buffer>socket.read(12))) {
                    return;
                }
                socket.removeListener('readable', arguments.callee);
                super.emit('connection', new PcpSocket(socket));
            });
        });
        this.httpServer.on('request',(req: http.IncomingMessage, res: http.ServerResponse) => {
            super.emit('request', req, res, new PcpSocket(req.socket));
        });

        this.httpServer.on('listening',() => {
            super.emit('listening');
        });
    }

    listen(port: number, backlog?: number): Promise<{}>;
    listen(port: number, hostname: string, backlog: number): Promise<{}>;
    listen(port: number, hostname: any, backlog?: any) {
        return new Promise((resolve, reject) => {
            this.httpServer.listen(port, hostname, backlog, resolve);
        });
    }
}

export function connect(port: number, host?: string) {
    logger.info('connecting... ' + host + ':' + port);
    return new Promise<PcpSocket>((resolve, reject) => {
        var socket = net.connect(port, host,() => {
            resolve(new PcpSocket(socket));
        });
    });
}

export function request(options: any) {
    return new Promise<{ statusCode: number; socket: PcpSocket; }>((resolve, reject) => {
        if (options.headers == null) {
            options.headers = {};
        }
        options.headers['x-peercast-pcp'] = 1;
        //options.headers['x-peercast-pos'] = 0;
        //options.headers['x-peercast-port'] = 7145;
        http.get(options, res => {
            resolve({
                statusCode: res.statusCode,
                socket: new PcpSocket(res.socket)
            });
        });
    });
}

function isPcpHeader(buffer: Buffer) {
    if (buffer == null) {
        return false;
    }
    if (buffer.slice(0, 4).toString('ascii') !== 'pcp\n') {
        return false;
    }
    if (buffer.readInt32LE(4) !== 4) {
        return false;
    }
}

function readablesify(socket: net.Socket) {
    var cache = new stream.PassThrough();
    socket.on('data',(data: Buffer) => {
        cache.write(data);
        socket.emit('readable');
    });
    socket.read = (size?: number) => cache.read(size);
}
