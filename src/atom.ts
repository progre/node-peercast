class Atom {
    static createContent(name: string, content: Buffer) {
        return new Atom(name, content, null);
    }

    static createIntContent(name: string, content: number) {
        var buffer = new Buffer(4);
        buffer.writeUInt32LE(content, 0);
        return Atom.createContent(name, buffer);
    }

    static createContainer(name: string, children: Atom[] = []) {
        return new Atom(name, null, children);
    }

    constructor(
        private _name: string,
        private _content: Buffer,
        private _children: Atom[]) {
    }

    get name() {
        return this._name;
    }

    get content() {
        if (this._content == null) {
            throw new Error('It\'s not content.');
        }
        return this._content;
    }

    get children() {
        if (this._children == null) {
            throw new Error('It\'s not container.');
        }
        return this._children;
    }

    isContent() {
        return this._content != null;
    }

    isContainer() {
        return this._children != null;
    }

    push(atom: Atom) {
        this._children.push(atom);
    }

    pushContent(name: string, content: Buffer) {
        this.push(Atom.createContent(name, content));
    }

    pushByteContent(name: string, content: number) {
        var buffer = new Buffer(1);
        buffer.writeUInt8(content, 0);
        this.push(Atom.createContent(name, buffer));
    }

    pushShortContent(name: string, content: number) {
        var buffer = new Buffer(2);
        buffer.writeUInt16LE(content, 0);
        this.push(Atom.createContent(name, buffer));
    }

    pushIntContent(name: string, content: number) {
        this.push(Atom.createIntContent(name, content));
    }

    pushStringContent(name: string, content: string) {
        this.push(Atom.createContent(name, new Buffer(content)));
    }

    pushGuidContent(name: string, content: Buffer) {
        this.push(Atom.createContent(name, content));
    }
}

export = Atom;
