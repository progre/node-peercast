import Atom = require('./atom');

export var HELLO = 'helo';
export var OLLEH = 'oleh';
export var HELLO_AGENT = 'agnt';
export var HELLO_OS_TYPE = 'ostp';
export var HELLO_SESSION_ID = 'sid\0';
export var HELLO_PORT = 'port';
export var HELLO_PING = 'ping';
export var HELLO_PONG = 'pong';
export var HELLO_REMOTE_IP = 'rip\0';
export var HELLO_VERSION = 'ver\0';
export var HELLO_BC_ID = 'bcid';
export var HELLO_DISABLE = 'dis\0';

export class Hello {
    constructor(
        public agent: string,
        public osType: number,
        public sessionId: Buffer,
        public port: number,
        public ping: number,
        public pong: any,
        public remoteIp: number,
        public version: number,
        public bcId: Buffer) {// byte[16]
    }

    toAtom() {
        var atom = Atom.createContainer(HELLO);
        atom.addContent(HELLO_AGENT, Atom.Type.STRING, this.agent);
        atom.addContent(HELLO_OS_TYPE, Atom.Type.INT, this.osType);
        atom.addContent(HELLO_SESSION_ID, Atom.Type.GUID, this.sessionId);
        atom.addContent(HELLO_PORT, Atom.Type.SHORT, this.port);
        atom.addContent(HELLO_PING, Atom.Type.SHORT, this.ping);
        atom.addContent(HELLO_PONG, Atom.Type.SHORT, this.pong);
        atom.addContent(HELLO_REMOTE_IP, Atom.Type.INT, this.remoteIp);
        atom.addContent(HELLO_VERSION, Atom.Type.INT, this.version);
        atom.addContent(HELLO_BC_ID, Atom.Type.GUID, this.bcId);
        return atom;
    }
}

export class Olleh extends Hello {
    toAtom() {
        var atom = Atom.createContainer(OLLEH);
        atom.addContent(HELLO_AGENT, Atom.Type.STRING, this.agent);
        atom.addContent(HELLO_SESSION_ID, Atom.Type.GUID, this.sessionId);
        atom.addContent(HELLO_PORT, Atom.Type.SHORT, this.port);
        atom.addContent(HELLO_REMOTE_IP, Atom.Type.INT, this.remoteIp);
        atom.addContent(HELLO_VERSION, Atom.Type.INT, this.version);
        return atom;
    }
}
