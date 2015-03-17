import log4js = require('log4js');
import Atom = require('./atom');

var logger = log4js.getLogger();

class HeaderReader {
    private head: string;
    private httpHeader: string;

    read(stream: NodeJS.ReadableStream): string|Atom {
        if (this.head == null) {
            var head = stream.read(4);
            if (head == null) {
                return;
            }
            this.head = head.toString();
            this.httpHeader = this.head;
        }
        if (this.head === 'pcp\n') {
            // pcp header
            var buffer = <Buffer>stream.read(8);
            if (buffer == null) {
                return null;
            }
            if (buffer.readInt32LE(0) !== 4) {
                throw new Error('Invalid header.');
            }
            logger.info('Remote pcp version: ' + buffer.readInt32LE(4));
            return Atom.createContent(this.head, buffer.slice(4, 8));
        } else if (this.head === 'GET ') {
            // http header
            logger.debug('HTTP header read. ');
            for (; ;) {
                var cBuffer = stream.read(1);
                if (cBuffer == null) {
                    return null;
                }
                var c = cBuffer.toString();
                this.httpHeader += c;
                var eoh = '\r\n\r\n';
                var readed = c === '\n' && this.httpHeader.lastIndexOf(eoh) >= 0;
                if (readed) {
                    // /channel/00000000000000000000000000000000 HTTP/1.0\r\nx-peercast-pcp:1\r\n\r\n
                    logger.debug('HTTP Header: ' + this.httpHeader);
                    return this.httpHeader;
                }
            }
        }
        throw new Error('Invalid header: ' + this.head);
    }
}

export = HeaderReader;
