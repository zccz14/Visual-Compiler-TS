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
    symbol: TerminalSymbol;
    constructor(symbol: string) {
        this.symbol = symbol;
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
    symbol: VSymbol;
    next: AST[];
    static isFirst(char: string): boolean {
        return char === '(' || isBasic(char);
    }
    constructor() {
        this.symbol = 'E';
        this.next = [];
    }
    /**
     * E -> (E)B|<Basic>B 
     */
    parse(state: ParseState): AST {
        if (state.get() === '(') {
            this.next.push(new TerminalASTNode(state.accept()));
            this.next.push(new E().parse(state));
            if (state.get() === ')') {
                this.next.push(new TerminalASTNode(state.accept()));
                this.next.push(new B().parse(state));
            } else {
                throw Error('expect ) in E');
            }
        } else if (isBasic(state.get())) {
            this.next.push(new TerminalASTNode(state.accept()));
            this.next.push(new B().parse(state));
        } else {
            throw Error('expect basic char');
        }
        return this;
    }

}

class A implements AST {
    symbol: VSymbol;
    next: AST[];
    static isFirst(char: string): boolean {
        return char === '*' || char === '|' || E.isFirst(char);
    }
    constructor() {
        this.symbol = 'A';
        this.next = [];
    }
    /**
     * A -> * | \|E | E
     */
    parse(state: ParseState): AST {
        if (state.get() === '*') {
            this.next.push(new TerminalASTNode(state.accept()));
        } else if (state.get() === '|') {
            this.next.push(new TerminalASTNode(state.accept()));
            this.next.push(new E().parse(state));
        } else if (E.isFirst(state.get())) {
            this.next.push(new E().parse(state));
        } else {
            throw Error('A error');
        }
        return this;
    }
}

class B implements AST {
    symbol: VSymbol;
    next: AST[];
    static isFirst(char: string): boolean {
        return !char || A.isFirst(char);
    }
    constructor() {
        this.symbol = 'B';
        this.next = [];
    }
    /**
     * B -> AB | <eps>
     */
    parse(state: ParseState): AST {
        if (A.isFirst(state.get())) {
            this.next.push(new A().parse(state));
            this.next.push(new B().parse(state));
        }
        return this;
    }
}