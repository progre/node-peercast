import AtomType = require('./atomtype');

class Atom {
    static createContent(name: string, type: AtomType, content: Buffer) {
        return new Atom(name, type, content, null);
    }

    static createContainer(name: string) {
        return new Atom(name, AtomType.CONTAINER, null, new Map<string, Atom>());
    }

    constructor(
        private _name: string,
        private _type: AtomType,
        private _content: Buffer,
        private _children: Map<string, Atom>) {
    }

    get name() {
        return this._name;
    }

    get type() {
        return this._type;
    }

    get content() {
        if (this._type === AtomType.CONTAINER) {
            throw new Error('It\'s container.');
        }
        return this._content;
    }

    get children() {
        if (this._type !== AtomType.CONTAINER) {
            throw new Error('It\'s content.');
        }
        return this._children;
    }

    add(atom: Atom) {
        if (this._type !== AtomType.CONTAINER) {
            throw new Error('It\'s content.');
        }
        this._children.set(atom._name, atom);
    }

    addContent(name: string, type: AtomType, content: Buffer) {
        this.add(Atom.createContent(name, type, content));
    }

    addByteContent(name: string, content: number) {
        var buffer = new Buffer(1);
        buffer.writeUInt8(content, 0);
        this.add(Atom.createContent(name, AtomType.BYTE, buffer));
    }

    addShortContent(name: string, content: number) {
        var buffer = new Buffer(2);
        buffer.writeUInt16LE(content, 0);
        this.add(Atom.createContent(name, AtomType.SHORT, buffer));
    }

    addIntContent(name: string, content: number) {
        var buffer = new Buffer(4);
        buffer.writeUInt32LE(content, 0);
        this.add(Atom.createContent(name, AtomType.INT, buffer));
    }

    addStringContent(name: string, content: string) {
        this.add(Atom.createContent(name, AtomType.STRING, new Buffer(content)));
    }

    addGuidContent(name: string, content: Buffer) {
        this.add(Atom.createContent(name, AtomType.GUID, content));
    }
}

export = Atom;
