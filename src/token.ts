import { objToRevMap, objToValArray, objToValInitials } from "./utils"

export enum Keyword {
    PERIOD = ".",
    NULL = "null",
    UNDEFINED = "undefined",
}
export const keywords = objToValArray(Keyword)

export enum UnOperator {
    NOT = "!"
}
export const unOperators = objToValArray(UnOperator)
export const unOperatorInitials = objToValInitials(UnOperator)

export enum BinOperator {
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
    MOD = "%",
    // bitwise not implemented
}
export const binOperators = objToValArray(BinOperator)
export const binOperatorInitials = objToValInitials(BinOperator)

export class Token { }

export class OpenTemplateToken extends Token { }
export class CloseTemplateToken extends Token { }
export class OpenParenthesisToken extends Token {  }
export class CloseParenthesisToken extends Token {  }
export class NumberToken extends Token {
    value: number
    constructor(value: number) { super(); this.value = value }
}
export class StringToken extends Token {
    value: string
    constructor(value: string) { super(); this.value = value }
}
export class KeywordToken extends Token {
    value: Keyword
    constructor(value: Keyword) { super(); this.value = value }
}
export class SymbolToken extends Token {
    value: string
    constructor(value: string) { super(); this.value = value }
}
export class UnOperatorToken extends Token {
    value: UnOperator
    constructor(value: UnOperator) { super(); this.value = value }
}
export class BinOperatorToken extends Token {
    value: BinOperator
    constructor(value: BinOperator) { super(); this.value = value }
}


