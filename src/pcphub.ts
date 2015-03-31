import net = require('net');
import http = require('http');
import log4js = require('log4js');
import PcpSocket = require('./pcpsocket');
import HeaderReader = require('./headerreader');
import path = require('path');

var logger = log4js.getLogger();

class PcpHub {
    private servers: net.Server[] = [];

    listen(port: number, connectionListener: (socket: PcpSocket) => void) {
        logger.info('listening... ' + port);
        var server = http.createServer((req, res) => {
            var url = path.normalize(req.url).split('?')[0].split('/');
            if (url[0] === 'channel') {
                if (url.length < 1 || url[1].length !== 32) {
                    res.writeHead(404);
                    res.end();
                    return;
                }
                //var id = url[1];
                // idにマッチする配信を持っているか？
                // 無い
                res.writeHead(404);
                res.end();
                return;
            }
            res.writeHead(404);
            res.end();
        });
        //var server = net.createServer(socket => {
        //    var headerReader = new HeaderReader();
        //    var readableListener = () => {
        //        var header = headerReader.read(socket);
        //        if (header == null) {
        //            return;
        //        }
        //        headerReader = null;
        //        socket.removeListener('readable', readableListener);
        //    };
        //    socket.addListener('readable', readableListener);
        //    connectionListener(new PcpSocket(socket));
        //});
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

function sendRequestWithNetModule(remoteAddress: string, remotePort: number, channelId: string) {
    return new Promise<{ statusCode: number; socket: net.Socket; }>((resolve, reject) => {
        var socket = net.connect(remotePort, remoteAddress,() => {
            socket.once('
            socket.write(
                'GET /channel/' + channelId + ' HTTP/1.0\r\n'
                + 'x-peercast-pcp:1\r\n'
                + '\r\n');
        });
    });
}

export = PcpHub;
