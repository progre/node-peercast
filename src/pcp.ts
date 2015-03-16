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
        atom.addStringContent(HELLO_AGENT, this.agent);
        atom.addIntContent(HELLO_OS_TYPE, this.osType);
        atom.addGuidContent(HELLO_SESSION_ID, this.sessionId);
        atom.addShortContent(HELLO_PORT, this.port);
        atom.addShortContent(HELLO_PING, this.ping);
        atom.addShortContent(HELLO_PONG, this.pong);
        atom.addIntContent(HELLO_REMOTE_IP, this.remoteIp);
        atom.addIntContent(HELLO_VERSION, this.version);
        atom.addGuidContent(HELLO_BC_ID, this.bcId);
        return atom;
    }
}

export class Olleh extends Hello {
    toAtom() {
        var atom = Atom.createContainer(OLLEH);
        atom.addStringContent(HELLO_AGENT, this.agent);
        atom.addGuidContent(HELLO_SESSION_ID, this.sessionId);
        atom.addShortContent(HELLO_PORT, this.port);
        atom.addIntContent(HELLO_REMOTE_IP, this.remoteIp);
        atom.addIntContent(HELLO_VERSION, this.version);
        return atom;
    }
}
