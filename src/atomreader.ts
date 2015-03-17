import log4js = require('log4js');
import Atom = require('./atom');

var logger = log4js.getLogger();

class AtomReader {
    private name: string;
    private length: number;
    private containerReader: AtomContainerReader;

    read(stream: NodeJS.ReadableStream) {
        if (this.name == null) {
            var headerBuffer = <Buffer>stream.read(8);
            if (headerBuffer == null) {
                return null;
            }
            this.name = headerBuffer.toString('ascii', 0, 4);
            this.length = headerBuffer.readUInt32LE(4);
        }
        logger.debug('Atom reading: ' + this.name);
        if ((this.length & 0x80000000) !== 0) {
            if (this.containerReader == null) {
                this.containerReader = new AtomContainerReader(this.length & 0x7FFFFFFF);
            }
            var children = this.containerReader.read(stream);
            if (children == null) {
                logger.debug('no children.');
                return null;
            }
            var container = Atom.createContainer(this.name, children);
            this.clear();
            return container;
        } else {
            var contentBuffer: Buffer;
            if (this.length === 0) {
                contentBuffer = null;
            } else {
                contentBuffer = <Buffer>stream.read(this.length);
                if (contentBuffer == null) {
                    logger.debug('no data: ' + this.length);
                    return null;
                }
            }
            var content = Atom.createContent(this.name, contentBuffer);
            this.clear();
            return content;
        }
    }

    clear() {
        this.name = null;
        this.length = 0;
        this.containerReader = null;
    }
}

class AtomContainerReader {
    private reader: AtomReader;
    private children: Atom[] = [];

    constructor(private length: number) {
    }

    read(stream: NodeJS.ReadableStream) {
        for (; ;) {
            if (this.reader == null) {
                this.reader = new AtomReader();
            }
            var atom = this.reader.read(stream);
            if (atom == null) {
                return null;
            }
            this.children.push(atom);
            if (this.children.length >= this.length) {
                return this.children;
            }
        }
    }
}

export = AtomReader;
