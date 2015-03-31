import events = require('events');
import net = require('net');
import stream = require('stream');
import log4js = require('log4js');
import Atom = require('./atom');
import AtomReader = require('./atomreader');
import pcp = require('./pcp');

const AGENT_NAME = 'node-peercast';
var logger = log4js.getLogger();

class PcpSocket extends events.EventEmitter {
    private reader = new AtomReader();

    constructor(private socket: net.Socket) {
        super();
        var localRemote = this.localRemote;
        socket.on('close',() => {
            logger.info('Closed: ' + localRemote);
            this.socket = null;
            this.emit('close');
        });
        socket.on('end',() => {
            logger.info('EOS: ' + localRemote + ', ' + this.socket.read());
        });
        var cache = new stream.PassThrough();
        //socket.on('readable',() => {
        //    logger.info('Incoming message: ' + localRemote);
        //    var atom = this.reader.read(socket);
        //    if (atom == null) {
        //        logger.debug('wait');
        //        return;
        //    }
        //    logger.info('Atom received: ' + atom.name);
        //    this.emit(pcp.toName(atom.name), atom);
        //});
        socket.on('data',(data: Buffer) => { // TODO: readable�o�O���Ă���ۂ�����Ȃ�Ƃ����Ăق���
            cache.write(data);
            logger.info('Incoming message: ' + localRemote);
            var atom = this.reader.read(cache);
            if (atom == null) {
                logger.debug('wait');
                return;
            }
            logger.info('Atom received: ' + atom.name);
            this.emit(pcp.toName(atom.name), atom);
        });
        logger.info('Connected: ' + localRemote);
    }

    sendHTTPHeader(channelId: string) {
        this.socket.write(
            'GET /channel/' + channelId + ' HTTP/1.0\r\n'
            + 'x-peercast-pcp:1\r\n'
            + '\r\n');
    }

    sendPCPHeader() {
        this.socket.write('pcp\n');
        writeInt32LE(this.socket, 4);
        writeInt32LE(this.socket, 1);
    }

    hello(port: number) {
        logger.info('Send hello: ' + this.localRemote);
        var sessionId = new Buffer(16);
        sessionId.fill(0);
        write(this.socket, pcp.createHello(
            AGENT_NAME,
            0,
            sessionId,
            port,
            port,
            1218, // TODO: ���ł��̃o�[�W�����H
            sessionId));
    }

    olleh() {
        logger.info('Send olleh: ' + this.localRemote);
        var sessionId = new Buffer(16);
        sessionId.fill(0);
        write(this.socket, pcp.createOlleh(
            AGENT_NAME,
            sessionId,
            0,
            0,
            0));
    }

    quit() {
        // ���ɐؒf�ς݂Ȃ牽�����Ȃ�
        if (this.socket == null) {
            return;
        }
        logger.info('Send quit: ' + this.localRemote);
        write(this.socket, pcp.createQuit());
        this.socket.end();
    }

    private get localRemote() {
        return this.socket.localAddress + ':' + this.socket.localPort + ', '
            + this.socket.remoteAddress + ':' + this.socket.remotePort;
    }
}

function write(stream: NodeJS.WritableStream, atom: Atom) {
    if (atom.name.length !== 4) {
        throw new Error('Invalid name: ' + atom.name);
    }
    logger.debug('Atom writing: ' + atom.name);
    stream.write(atom.name);
    if (atom.isContainer()) {
        writeInt32LE(stream, 0x80000000 | atom.children.length);
        atom.children.forEach(child => {
            write(stream, child);
        });
    } else {
        writeInt32LE(stream, atom.content.length);
        stream.write(atom.content);
    }
}

function writeInt32LE(stream: NodeJS.WritableStream, value: number) {
    var buffer = new Buffer(4);
    buffer.writeInt32LE(value, 0);
    stream.write(buffer);
}


export = PcpSocket;
