import { TofuInputStream } from "./inputstream";
import { BinOperatorToken, KeywordToken, NumberToken, StringToken, SymbolToken, Token, UnOperatorToken } from "./token";
import { Either } from "fp-ts/Either";
export declare class TofuLexer {
    inputStream: TofuInputStream;
    current: Either<string, Token> | null;
    constructor(inputStream: TofuInputStream);
    readWhile(predicate: Function): Either<string, string>;
    readNumber(): Either<string, NumberToken>;
    readEscaped(): Either<string, string>;
    readString(): Either<string, StringToken>;
    readSymbol(): Either<string, SymbolToken | KeywordToken>;
    readOperator(operator: Object): Either<string, UnOperatorToken | BinOperatorToken>;
    readNext(): Either<string, Token>;
    peek(): Either<string, Token>;
    next(): Either<string, Token>;
    eof(): boolean;
}
