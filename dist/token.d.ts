export declare enum Keyword {
    PERIOD = ".",
    NULL = "null",
    UNDEFINED = "undefined"
}
export declare const keywords: string[];
export declare enum UnOperator {
    NOT = "!"
}
export declare const unOperators: string[];
export declare const unOperatorInitials: String[];
export declare enum BinOperator {
    LESS = "<",
    LESS_OR_EQUALS = "<=",
    SOFT_EQUALS = "==",
    HARD_EQUALS = "===",
    GREATER_OR_EQUALS = ">=",
    GREATER = ">",
    SOFT_NOT_EQUALS = "!=",
    HARD_NOT_EQUALS = "!==",
    AND = "&&",
    OR = "||",
    XOR = "^",
    NULLC = "??",
    ADD = "+",
    SUB = "-",
    MUL = "*",
    EXP = "**",
    DIV = "/",
    MOD = "%"
}
export declare const binOperators: string[];
export declare const binOperatorInitials: String[];
export declare class Token {
    line: number;
    col: number;
    constructor(line: number, col: number);
}
export declare class OpenTemplateToken extends Token {
}
export declare class CloseTemplateToken extends Token {
}
export declare class OpenParenthesisToken extends Token {
}
export declare class CloseParenthesisToken extends Token {
}
export declare class NumberToken extends Token {
    value: number;
    constructor(value: number, line: number, col: number);
}
export declare class StringToken extends Token {
    value: string;
    constructor(value: string, line: number, col: number);
}
export declare class KeywordToken extends Token {
    value: Keyword;
    constructor(value: Keyword, line: number, col: number);
}
export declare class SymbolToken extends Token {
    value: string;
    constructor(value: string, line: number, col: number);
}
export declare class UnOperatorToken extends Token {
    value: UnOperator;
    constructor(value: UnOperator, line: number, col: number);
}
export declare class BinOperatorToken extends Token {
    value: BinOperator;
    constructor(value: BinOperator, line: number, col: number);
}
