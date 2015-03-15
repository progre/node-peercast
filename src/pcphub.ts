import net = require('net');

class PcpHub {
    listen(port: number) {
        var server = net.createServer(socket => {
            // TODO:
        });
        server.listen(port);
    }
}

export = PcpHub;
