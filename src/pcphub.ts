import net = require('net');
import log4js = require('log4js');
import PcpSocket = require('./pcpsocket');
import HeaderReader = require('./headerreader');

var logger = log4js.getLogger();

class PcpHub {
    private servers: net.Server[] = [];

    listen(port: number, connectionListener: (socket: PcpSocket) => void) {
        logger.info('listening... ' + port);
        var server = net.createServer(socket => {
            var headerReader = new HeaderReader();
            var readableListener = () => {
                var header = headerReader.read(socket);
                if (header == null) {
                    return;
                }
                headerReader = null;
                socket.removeListener('readable', readableListener);
            };
            socket.addListener('readable', readableListener);
            connectionListener(new PcpSocket(socket));
        });
        server.listen(port);
        this.servers.push(server);
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
        // TODO: httpƒ‚ƒWƒ…[ƒ‹‚Å‚Å‚«‚é‚æ‚¤‚È‚ç‚»‚¤‚µ‚½‚¢
        //var client = http.request({
        //    host: remoteAddress,
        //    port: remotePort,
        //    path: '/channel/' + channelId,
        //    headers: {
        //        'x-peercast-pcp': 1
        //        //'x-peercast-pos': 0,
        //        //'x-peercast-port': 7145
        //    }
        //},(res: http.ClientResponse) => {
        //    });
        var socket = net.connect(remotePort, remoteAddress,() => {
            socket.write(
                'GET /channel/' + channelId + ' HTTP/1.0\r\n'
                + 'x-peercast-pcp:1\r\n'
                + '\r\n');
        });
        readHTTPHeader(socket).then(header => {

        });
        var radableListener = () => {
            var data = reader.read(socket);
            if (data == null) {
                return;
            }
            var psocket = new PcpSocket(socket);
            logger.debug('BODY: ' + socket.read());
            psocket.on('olleh',() => {
                console.log('oleh!');
            });
            psocket.on('quit',() => {
                console.log('quit!?');
            });
            psocket.hello(7147);
        });
        socket.on('readable', radableListener);
    }

    close() {
        this.servers.forEach(server => {
            server.close();
        });
        this.servers = [];
    }
}

function readHTTPHeader(socket: net.Socket) {
    var data = '';
    var FOOTER = '\r\n\r\n';
    return new Promise<string>((resolve, reject) => {
        var readableListener = () => {
            for (; ;) {
                var datum = socket.read(1);
                if (datum == null) {
                    return null;
                }
                data += datum;
                if (datum === '\n'
                    && data.lastIndexOf(FOOTER) === data.length - FOOTER.length) {
                    removeListener();
                    resolve(data);
                    return;
                }
            }
        };
        var endListener = () => {
            removeListener();
            reject();
        };
        var removeListener = () => {
            socket.removeListener('readableListener', readableListener);
            socket.removeListener('close', endListener);
        };
        socket.on('readable', readableListener);
        socket.on('close', endListener);
    });
}

export = PcpHub;
