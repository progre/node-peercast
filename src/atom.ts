type Content = number|string|Buffer;

class Atom {
    static createContent(name: string, content: Content) {
        return new Atom(name, content, null);
    }

    static createContainer(name: string) {
        return new Atom(name, null, new Map<string, Atom>());
    }

    constructor(
        private name: string,
        private content: Content,
        private children: Map<string, Atom>) {
    }

    add(atom: Atom) {
        this.children.set(atom.name, atom);
    }
}

export = Atom;
