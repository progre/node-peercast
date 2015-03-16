
declare module Atom {
    enum Type {
        CONTAINER,
        BYTE,
        SHORT,
        INT,
        STRING,
        GUID
    }
    type Content = number|string|Buffer;
}

class Atom {
    static createContent(name: string, type: Atom.Type, content: Atom.Content) {
        return new Atom(name, type, content, null);
    }

    static createContainer(name: string) {
        return new Atom(name, Atom.Type.CONTAINER, null, new Map<string, Atom>());
    }

    constructor(
        private _name: string,
        private _type: Atom.Type,
        private _content: Atom.Content,
        private _children: Map<string, Atom>) {
    }

    name() {
        return this._name;
    }

    type() {
        return this._type;
    }

    content() {
        if (this._type === Atom.Type.CONTAINER) {
            throw new Error('It\'s container.');
        }
        return this._content;
    }

    children() {
        if (this._type !== Atom.Type.CONTAINER) {
            throw new Error('It\'s content.');
        }
        return this._children;
    }

    add(atom: Atom) {
        if (this._type !== Atom.Type.CONTAINER) {
            throw new Error('It\'s content.');
        }
        this._children.set(atom._name, atom);
    }

    addContent(name: string, type: Atom.Type, content: Atom.Content) {
        this.add(Atom.createContent(name, type, content));
    }
}

export = Atom;
