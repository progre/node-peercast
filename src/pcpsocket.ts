import events = require('events');
import net = require('net');
import Atom = require('./atom');
import pcp = require('./pcp');

const AGENT_NAME = 'node-peercast';

class PcpSocket extends events.EventEmitter {
    constructor(private socket: net.Socket) {
        super();
    }

    hello(port: number) {
        var atom = new pcp.Hello(
            AGENT_NAME,
            0,
            new Buffer(0),
            0,
            port,
            0,
            0,
            0,
            new Buffer(0)
            ).toAtom();
        this.send(atom);
    }

    private send<T>(atom: Atom) {
        var stream = this.socket;
        if (atom.name().length !== 4) {
            throw new Error('Invalid name: ' + atom.name());
        }
        stream.write(atom.name());
        switch (atom.type()) {
            case Atom.Type.CONTAINER:
                throw new Error('Not implemented.');
            case Atom.Type.BYTE:
                throw new Error('Not implemented.');
            case Atom.Type.SHORT:
                throw new Error('Not implemented.');
            case Atom.Type.INT:
                throw new Error('Not implemented.');
            case Atom.Type.STRING:
                throw new Error('Not implemented.');
            case Atom.Type.GUID:
                throw new Error('Not implemented.');
            default:
                throw new Error('Invalid type: ' + atom.type());
        }
    }
}

export = PcpSocket;
