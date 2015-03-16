/// <reference path="../typings.d.ts" />
require('es6-shim');
try { // optional
    require('source-map-support').install();
} catch (e) {
}
import PeerCast = require('./peercast');
export = PeerCast;
