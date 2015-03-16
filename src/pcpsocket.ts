import events = require('events');
import net = require('net');
import Atom = require('./atom');
import AtomType = require('./atomtype');
import pcp = require('./pcp');

const AGENT_NAME = 'node-peercast';

class PcpSocket extends events.EventEmitter {
    constructor(private socket: net.Socket) {
        super();
        // TODO: éÛêMé¿ëï
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
        if (atom.name.length !== 4) {
            throw new Error('Invalid name: ' + atom.name);
        }
        stream.write(atom.name);
        var buffer = new Buffer(4);
        if (atom.type === AtomType.CONTAINER) {
            buffer.writeInt32LE(0x80000000 | atom.children.size, 0);
            stream.write(buffer);
            atom.children.forEach(child => {
                this.send(child);
            });
        } else {
            buffer.writeUInt32LE(atom.content.length, 0);
            stream.write(buffer);
            stream.write(atom.content);
        }
    }
}

export = PcpSocket;
