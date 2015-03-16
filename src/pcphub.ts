import net = require('net');
import PcpSocket = require('./pcpsocket');

class PcpHub {
    listen(port: number, connectionListener: Function) {
        var server = net.createServer(socket => {
            connectionListener(new PcpSocket(socket));
        });
        server.listen(port);
    }

    connect(host: string, port: number, connectionListener: Function) {
        var socket = net.connect(port, host,() => {
            connectionListener(new PcpSocket(socket));
        });
    }
}

export = PcpHub;
