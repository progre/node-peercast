import http = require('http');
import net = require('net');
import path = require('path');
import stream = require('stream');
import log4js = require('log4js');
import PcpSocket = require('./pcpsocket');
import HeaderReader = require('./headerreader');

var logger = log4js.getLogger();

class PcpHub {
    private servers: net.Server[] = [];

    listen(port: number, connectionListener: (socket: PcpSocket) => void) {
        logger.info('listening... ' + port);
        var cache = new stream.PassThrough();
        var server = http.createServer();
        server.on('connection',(socket: net.Socket) => {
            logger.debug('connected: ' + socket.remoteAddress + ':' + socket.remotePort);
            // http.Serverのsocketはreadableイベントを発行しない
            socket.on('data',(data: Buffer) => {
                cache.write(data);
                if (!isPcpHeader(<Buffer>cache.read(12))) {
                    return;
                }
                socket.removeListener('data', arguments.callee);
                connectionListener(new PcpSocket(socket));
            });
        });
        server.on('request',(req: http.IncomingMessage, res: http.ServerResponse) => {
            var url = path.normalize(req.url).split('?')[0].split('/');
            if (url[0] === 'channel') {
                if (url.length < 1 || url[1].length !== 32) {
                    res.writeHead(404);
                    res.end();
                    return;
                }
                // idにマッチする配信を持っているか？
                // 無い
                res.writeHead(404);
                res.end();
                return;
            }
            res.writeHead(404);
            res.end();
        });
        server.listen(port);
        //this.servers.push(server);
    }

    connect(host: string, port: number) {
        return new Promise<PcpSocket>((resolve, reject) => {
            logger.info('connecting... ' + host + ':' + port);
            var socket = net.connect(port, host,() => {
                resolve(new PcpSocket(socket));
            });
        });
    }

    getStream(remoteAddress: string, remotePort: number, channelId: string) {
        sendRequestWithHTTPModule(remoteAddress, remotePort, channelId).then(res => {
            logger.debug('status: ' + res.statusCode);
            if (res.statusCode === 404) {
                return;
            }
            var socket = new PcpSocket(res.socket);
            if (res.statusCode === 200) {
                socket.hello(0);
                socket.on('olleh',() => {
                    console.log('olleh!');
                });
                return;
            }
            if (res.statusCode === 503) {
                socket.hello(0);
                return;
            }
        });
    }

    close() {
        this.servers.forEach(server => {
            server.close();
        });
        this.servers = [];
    }
}

function sendRequestWithHTTPModule(remoteAddress: string, remotePort: number, channelId: string) {
    return new Promise<{ statusCode: number; socket: net.Socket; }>((resolve, reject) => {
        http.get({
            host: remoteAddress,
            port: remotePort,
            path: '/channel/' + channelId,
            headers: {
                'x-peercast-pcp': 1
                //'x-peercast-pos': 0,
                //'x-peercast-port': 7145
            }
        }, res => {
                resolve({
                    statusCode: res.statusCode,
                    socket: res.socket
                });
            });
    });
}

//function sendRequestWithNetModule(remoteAddress: string, remotePort: number, channelId: string) {
//    return new Promise<{ statusCode: number; socket: net.Socket; }>((resolve, reject) => {
//        var socket = net.connect(remotePort, remoteAddress,() => {
//            socket.write(
//                'GET /channel/' + channelId + ' HTTP/1.0\r\n'
//                + 'x-peercast-pcp:1\r\n'
//                + '\r\n');
//            var reader = new HeaderReader();
//            socket.on('readable',() => {
//                reader.read(socket);
//            });
//        });
//    });
//}

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

export = PcpHub;
