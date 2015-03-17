import net = require('net');
import log4js = require('log4js');
import PcpSocket = require('./pcpsocket');
import HeaderReader = require('./headerreader');

var logger = log4js.getLogger();

class PcpHub {
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
    }

    connect(host: string, port: number, connectionListener: (socket: PcpSocket) => void) {
        logger.info('connecting... ' + host + ':' + port);
        var socket = net.connect(port, host,() => {
            connectionListener(new PcpSocket(socket));
        });
    }
}

export = PcpHub;
