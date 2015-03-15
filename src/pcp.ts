import Atom = require('./atom');

export var HELLO = 'helo';
export var OLLEH = 'oleh';
export var HELLO_AGENT = 'agnt';
export var HELLO_OS_TYPE = 'ostp';
export var HELLO_SESSION_ID = 'sid';
export var HELLO_PORT = 'port';
export var HELLO_PING = 'ping';
export var HELLO_PONG = 'pong';
export var HELLO_REMOTE_IP = 'rip';
export var HELLO_VERSION = 'ver';
export var HELLO_BC_ID = 'bcid';
export var HELLO_DISABLE = 'dis';

export class Hello {
    constructor(
        public agent: string,
        public osType: number,
        public sessionId: Buffer,// byte[16]
        public port: number,
        public ping: number,
        public pong: any,
        public remoteIp: number,
        public version: number,
        public bcId: Buffer) {// byte[16]
    }

    toAtom() {
        var atom = Atom.createContainer(HELLO);
        atom.add(Atom.createContent(HELLO_AGENT, this.agent));
        atom.add(Atom.createContent(HELLO_OS_TYPE, this.osType));
        atom.add(Atom.createContent(HELLO_SESSION_ID, this.sessionId));
        atom.add(Atom.createContent(HELLO_PORT, this.port));
        atom.add(Atom.createContent(HELLO_PING, this.ping));
        atom.add(Atom.createContent(HELLO_PONG, this.pong));
        atom.add(Atom.createContent(HELLO_REMOTE_IP, this.remoteIp));
        atom.add(Atom.createContent(HELLO_VERSION, this.version));
        atom.add(Atom.createContent(HELLO_BC_ID, this.bcId));
        return atom;
    }
}

export class olleh extends Hello {
    toAtom() {
        var atom = Atom.createContainer(OLLEH);
        atom.add(Atom.createContent(HELLO_AGENT, this.agent));
        atom.add(Atom.createContent(HELLO_SESSION_ID, this.sessionId));
        atom.add(Atom.createContent(HELLO_PORT, this.port));
        atom.add(Atom.createContent(HELLO_REMOTE_IP, this.remoteIp));
        atom.add(Atom.createContent(HELLO_VERSION, this.version));
        return atom;
    }
}
