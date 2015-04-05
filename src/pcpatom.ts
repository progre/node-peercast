import log4js = require('log4js');
import Atom = require('./atom');

var logger = log4js.getLogger();

const OK = 'ok\0\0';
const HELLO = 'helo';
const OLLEH = 'oleh';
const HELLO_AGENT = 'agnt';
const HELLO_OS_TYPE = 'ostp';
const HELLO_SESSION_ID = 'sid\0';
const HELLO_PORT = 'port';
const HELLO_PING = 'ping';
const HELLO_VERSION = 'ver\0';
const HELLO_BC_ID = 'bcid';
//const OLLEH_PONG = 'pong';
const OLLEH_REMOTE_IP = 'rip\0';
//const OLLEH_DISABLE = 'dis\0';
const HOST = 'host';
const CHANNEL = 'chan';
const QUIT = 'quit';

export function toName(simpleName: string) {
    switch (simpleName) {
        case OK:
            return 'ok';
        case HELLO:
            return 'hello';
        case OLLEH:
            return 'olleh';
        case HOST:
            return 'host';
        case QUIT:
            return 'quit';
        case CHANNEL:
            return 'channel';
        default:
            logger.warn('Unsupported name: ' + simpleName);
            return simpleName;
    }
}

export function createHello(
    agent: string,
    osType: string,
    sessionId: Buffer,
    port: number,
    ping: number,
    version: number,
    bcId: Buffer
    ) {
    var atom = Atom.createContainer(HELLO);
    atom.pushStringContent(HELLO_AGENT, agent);
    atom.pushString4Content(HELLO_OS_TYPE, osType);
    atom.pushGuidContent(HELLO_SESSION_ID, sessionId);
    atom.pushShortContent(HELLO_PORT, port);
    atom.pushShortContent(HELLO_PING, ping);
    atom.pushIntContent(HELLO_VERSION, version);
    atom.pushGuidContent(HELLO_BC_ID, bcId);
    return atom;
}

export function createOlleh(
    agent: string,
    sessionId: Buffer,
    port: number,
    remoteIp: number,
    version: number
    ) {
    var atom = Atom.createContainer(OLLEH);
    atom.pushStringContent(HELLO_AGENT, agent);
    atom.pushGuidContent(HELLO_SESSION_ID, sessionId);
    atom.pushShortContent(HELLO_PORT, port);
    //atom.pushShortContent(HELLO_PONG, pong);
    atom.pushIntContent(OLLEH_REMOTE_IP, remoteIp);
    atom.pushIntContent(HELLO_VERSION, version);
    return atom;
}

export function createQuit() {
    return Atom.createIntContent(QUIT, 0);
}
