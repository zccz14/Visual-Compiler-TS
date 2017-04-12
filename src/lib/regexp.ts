class ParseState {
    idx: number;
    exp: string;
    constructor(exp: string) {
        this.exp = exp;
        this.idx = 0;
    }
    get(): string {
        return this.exp.charAt(this.idx);
    }
    accept(): string {
        this.idx++;
        return this.exp.charAt(this.idx - 1);
    }
    get done(): boolean {
        return this.idx === this.exp.length;
    }
};

export function parseRegExp(exp: string): AST {
    let state = new ParseState(exp);
    let ST = new E().parse(state);
    if (!state.done) {
        throw new Error('expect end');
    }
    return ST;
}

class TerminalASTNode implements AST {
    name: TerminalSymbol;
    constructor(symbol: string) {
        this.name = symbol;
    }
}

function isBasic(char: string): boolean {
    switch (char) {
        case '':
        case '(':
        case ')':
        case '*':
        case '|':
            return false;
        default:
            return true;
    }
}

class E implements AST {
    name: VSymbol;
    children: AST[];
    static isFirst(char: string): boolean {
        return char === '(' || isBasic(char);
    }
    constructor() {
        this.name = 'E';
        this.children = [];
    }
    /**
     * E -> (E)B|<Basic>B 
     */
    parse(state: ParseState): AST {
        if (state.get() === '(') {
            this.children.push(new TerminalASTNode(state.accept()));
            this.children.push(new E().parse(state));
            if (state.get() === ')') {
                this.children.push(new TerminalASTNode(state.accept()));
                this.children.push(new B().parse(state));
            } else {
                throw Error('expect ) in E');
            }
        } else if (isBasic(state.get())) {
            this.children.push(new TerminalASTNode(state.accept()));
            this.children.push(new B().parse(state));
        } else {
            throw Error('expect basic char');
        }
        return this;
    }

}

class A implements AST {
    name: VSymbol;
    children: AST[];
    static isFirst(char: string): boolean {
        return char === '*' || char === '|' || E.isFirst(char);
    }
    constructor() {
        this.name = 'A';
        this.children = [];
    }
    /**
     * A -> * | \|E | E
     */
    parse(state: ParseState): AST {
        if (state.get() === '*') {
            this.children.push(new TerminalASTNode(state.accept()));
        } else if (state.get() === '|') {
            this.children.push(new TerminalASTNode(state.accept()));
            this.children.push(new E().parse(state));
        } else if (E.isFirst(state.get())) {
            this.children.push(new E().parse(state));
        } else {
            throw Error('A error');
        }
        return this;
    }
}

class B implements AST {
    name: VSymbol;
    children: AST[];
    static isFirst(char: string): boolean {
        return !char || A.isFirst(char);
    }
    constructor() {
        this.name = 'B';
        this.children = [];
    }
    /**
     * B -> AB | <eps>
     */
    parse(state: ParseState): AST {
        if (A.isFirst(state.get())) {
            this.children.push(new A().parse(state));
            this.children.push(new B().parse(state));
        }
        return this;
    }
}