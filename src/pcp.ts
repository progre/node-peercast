import log4js = require('log4js');
import Atom = require('./atom');

var logger = log4js.getLogger();

var HELLO = 'helo';
var OLLEH = 'oleh';
var HELLO_AGENT = 'agnt';
var HELLO_OS_TYPE = 'ostp';
var HELLO_SESSION_ID = 'sid\0';
var HELLO_PORT = 'port';
var HELLO_PING = 'ping';
var HELLO_VERSION = 'ver\0';
var HELLO_BC_ID = 'bcid';
//var OLLEH_PONG = 'pong';
var OLLEH_REMOTE_IP = 'rip\0';
//var OLLEH_DISABLE = 'dis\0';

var QUIT = 'quit';

export function toName(simpleName: string) {
    switch (simpleName) {
        case HELLO:
            return 'hello';
        case OLLEH:
            return 'olleh';
        case QUIT:
            return 'quit';
        default:
            logger.warn('Unsupported name: ' + simpleName);
            return simpleName;
    }
}

export function createHello(
    agent: string,
    osType: number,
    sessionId: Buffer,
    port: number,
    ping: number,
    version: number,
    bcId: Buffer
    ) {
    var atom = Atom.createContainer(HELLO);
    atom.pushStringContent(HELLO_AGENT, agent);
    atom.pushIntContent(HELLO_OS_TYPE, osType);
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
