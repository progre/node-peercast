import events = require('events');
import log4js = require('log4js');
import PcpHub = require('./pcphub');

var logger = log4js.getLogger();

class PeerCast extends events.EventEmitter {
    private hub = new PcpHub();

    constructor(private localPort: number) {
        super();
        this.hub.listen(localPort, socket => {
            socket.on('hello',() => {
                socket.olleh();
            });
            this.on('end',() => {
            });
        });
    }

    connect(remoteAddress: string, remotePort: number) {
        this.hub.connect(remoteAddress, remotePort, socket => {
            socket.on('olleh',() => {
                this.emit('connected');
            });
            socket.sendPCPHeader();
            socket.hello(this.localPort);
            this.on('end',() => {
                socket.quit();
            });
        });
    }

    quit() {
        logger.debug('quit()');
        this.emit('end');
    }
}

export = PeerCast;
