class ParseState {
    idx: number;
    exp: string;
    constructor(exp: string, idx: number) {
        this.exp = exp;
        this.idx = idx;
    }
    get(): string {
        return this.exp.charAt(this.idx);
    }
    accept(): string {
        this.idx++;
        return this.exp.charAt(this.idx - 1);
    }
};

export function parseRegExp(exp: string): AST {
    return new E().parse(new ParseState(exp, 0));
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
    parse(state: ParseState): AST {
        console.log(this);
        if (state.get() === '(') {
            this.next.push(new TerminalASTNode(state.accept()));
            this.next.push(new E().parse(state));
            if (state.get() === ')') {
                this.next.push(new TerminalASTNode(state.accept()));
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
    parse(state: ParseState): AST {
        console.log(this);
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
    parse(state: ParseState): AST {
        console.log(this);
        if (A.isFirst(state.get())) {
            this.next.push(new A().parse(state));
            this.next.push(new B().parse(state));
        }
        return this;
    }
}