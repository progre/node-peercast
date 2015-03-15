import events = require('events');
import Atom = require('./atom');
import pcp = require('./pcp');

const AGENT_NAME = 'node-peercast';

class PcpSocket extends events.EventEmitter {
    constructor(private port: number, private remoteAddr: string) {
        super();
    }

    hello() {
        var atom = new pcp.Hello(
            AGENT_NAME,
            0,
            new Buffer(0),
            this.port,
            this.port,
            0,
            0,
            0,
            new Buffer(0)
            );
        atom.toAtom();
        this.send(hello);
    }
    //put(name: string, value: any) {
    //    putil.deleteIf(this.children,(c: Atom) => c.name === name);
    //    var atom = new Atom(name, [], null);
    //    atom.value = value;
    //    this.children.push(atom);
    //    return value;
    //}

    private send(atom: Atom) {
        if (atom.content != null) {
            //var buffer = new Buffer(4 + 4 + atom.content.length);
            //buffer.write(putil.padRight(this.name, 4, '\0'));
            //buffer.writeUInt32LE(this.content.length, 4);
            //this.content.copy(buffer, 8);
            //stream.write(buffer);
        }
        if (atom.children != null) {
            //
        }
        throw new Error('Invalid atom.');
        //if (this.children != null && this.children.length > 0) {
        //    var buffer = new Buffer(8);
        //    buffer.write(putil.padRight(this.name, 4, '\0'));
        //    buffer.writeInt32LE(this.children.length | 0x80000000, 4);
        //    stream.write(buffer);
        //    this.children.forEach(c=> {
        //        c.writeTo(stream);
        //    });
        //} else {
        //if (this.content == null)
        //    throw new Error('content is null. name: ' + this.name);
    }
}

export = PcpSocket;
