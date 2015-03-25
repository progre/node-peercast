import http = require('http');
import net = require('net');
import events = require('events');
import log4js = require('log4js');
import PcpHub = require('./pcphub');
import PcpSocket = require('./pcpsocket');

var logger = log4js.getLogger();

class PeerCast extends events.EventEmitter {
    private hub = new PcpHub();

    constructor(private localPort: number) {
        super();
    }

    listen() {
        return new Promise((resolve, reject) => {
            this.hub.listen(this.localPort, socket => {
                socket.on('hello',() => {
                    socket.olleh();
                });
                this.on('end',() => {
                });
                resolve();
            });
        });
    }

    connect(remoteAddress: string, remotePort: number) {
        return this.hub.connect(remoteAddress, remotePort).then(
            socket => new Promise((resolve, reject) => {
                socket.once('olleh',() => resolve());
                socket.sendPCPHeader();
                socket.hello(this.localPort);
                this.on('end',() => {
                    socket.quit();
                });
            }));
    }

    getStream(remoteAddress: string, remotePort: number, channelId: string) {
        return this.hub.getStream(remoteAddress, remotePort, channelId);
    }

    quit() {
        logger.debug('quit()');
        this.emit('end');
    }
}

export = PeerCast;
