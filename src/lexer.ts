import { TofuInputStream } from "./inputstream"
import { BinOperator, BinOperatorToken, CloseParenthesisToken, CloseTemplateToken, Keyword, KeywordToken, NumberToken, OpenParenthesisToken, OpenTemplateToken, StringToken, SymbolToken, Token, UnOperator, UnOperatorToken, binOperatorInitials, binOperators, keywords, unOperatorInitials, unOperators } from "./token"
import { Either, left, right, match, isLeft } from "fp-ts/Either"
import { pipe } from "fp-ts/function"


function isKeyword(x: string) {
    return keywords.indexOf(x) > -1
}

function isUnOperator(x: string) {
    return unOperators.indexOf(x) > -1
}

function isBinOperator(x: string) {
    return binOperators.indexOf(x) > -1
}

function isDigit(chr: string) {
    return /[0-9]/i.test(chr)
}

function isWhitespace(chr: string) {
    return /[\s\t\n\r]/i.test(chr)
}

function isSymbolStart(chr: string) {
    return /[a-z\$_]/i.test(chr)
}

function isSymbolBody(chr: string) {
    return /[a-z\$_0-9]/i.test(chr)
}

function isUnOperatorStart(chr: string) {
    return unOperatorInitials.indexOf(chr) > -1
}

function isBinOperatorStart(chr: string) {
    return binOperatorInitials.indexOf(chr) > -1
}

const CHAR_TO_ESCAPED = {
    "n": "\n",
    "r": "\r",
    "t": "\t",
    "s": "\s",
    "0": "\0",
    "\\": "\\",
    "'": "'",
    '"': '"',
}


export class TofuLexer {
    inputStream: TofuInputStream
    current: Either<string, Token> | null = null

    constructor(inputStream: TofuInputStream) {
        this.inputStream = inputStream
    }

    readWhile(predicate: Function): Either<string, string> {
        let str = ""
        while (predicate(this.inputStream.peek())) {
            str += this.inputStream.next()

            if (this.inputStream.eof()) {
                return left(this.inputStream.croak("Unexpected EOF"))
            }

        }


        if (str === "")
            return left(this.inputStream.croak("Unmatched token"))

        return right(str)
    }

    readNumber(): Either<string, NumberToken> {
        let hasDot = false
        let err: string | null = null

        let { line, col } = this.inputStream

        let numberRes = this.readWhile((chr: string) => {
            if (chr == ".") {
                if (hasDot) {
                    err = this.inputStream.croak("Unexpected .")
                    return false
                }
                hasDot = true
                return true
            }
            return isDigit(chr)
        })

        if (err != null) return left(err)

        return pipe(
            numberRes,
            match(
                number => right(new NumberToken(parseFloat(number), line, col)),
                err => left(err)
            )
        )

    }

    readEscaped(): Either<string, string> {
        let isEscaped = false, str = ""
        if (this.inputStream.eof())
            return left(this.inputStream.croak("Unexpected EOF"))
        let end = this.inputStream.next()

        while (true) {
            if (this.inputStream.eof())
                return left(this.inputStream.croak("Unexpected EOF"))

            let chr = this.inputStream.next()

            if (isEscaped) {
                if (!CHAR_TO_ESCAPED[chr]) {
                    return left(this.inputStream.croak(`Cannot escape ${chr}`))
                }
                str += CHAR_TO_ESCAPED[chr]
                isEscaped = false
            } else if (chr == "\\") {
                isEscaped = true
            } else if (chr == end) {
                break
            } else {
                str += chr
            }

        }


        return right(str)
    }

    readString(): Either<string, StringToken> {

        let { line, col } = this.inputStream

        return pipe(
            this.readEscaped(),
            match(
                err => left(err),
                text => right(new StringToken(text, line, col))
            )
        )
    }

    readSymbol(): Either<string, SymbolToken | KeywordToken> {

        let { line, col } = this.inputStream

        return pipe(
            this.readWhile(isSymbolBody),
            match(
                err => left(err),
                tokenStr => isKeyword(tokenStr)
                    ? right(new KeywordToken(tokenStr as Keyword, line, col))
                    : right(new SymbolToken(tokenStr, line, col))
            )
        )
    }

    readOperator(operator: Object): Either<string, UnOperatorToken | BinOperatorToken> {

        let { line, col } = this.inputStream

        let remaining = Object.values(operator)
        let idx = 0
        return pipe(
            this.readWhile((chr: string) => {
                if (remaining.length == 0) return false


                let newRemaining: Array<string> = []
                for (let op of remaining) {
                    if (op.charAt(idx) != chr) continue
                    newRemaining.push(op)
                }
                remaining = newRemaining

                idx++

                if (remaining.length == 0) return false
                else return true
            }),
            match(
                err => left(err),
                opStr => isBinOperator(opStr)
                    ? right(new BinOperatorToken(opStr as BinOperator, line, col))
                    : isUnOperator(opStr)
                        ? right(new UnOperatorToken(opStr as UnOperator, line, col))
                        : left(this.inputStream.croak(`Unknown operator "${opStr}"`))
            )
        )
    }


    readNext(): Either<string, Token> {

        let { line, col } = this.inputStream

        let chr = this.inputStream.peek()
        if (chr === "{") {
            this.inputStream.next()
            return right(new OpenTemplateToken(line, col))
        }


        if (chr === "}") {
            this.inputStream.next()
            return right(new CloseTemplateToken(line, col))
        }

        let res = this.readWhile(isWhitespace);

        if (this.inputStream.eof())
            return left(this.inputStream.croak("Unexpected EOF"))
        chr = this.inputStream.peek()

        line = this.inputStream.line
        col = this.inputStream.col

        if (chr === '"') return this.readString()
        if (chr === "'") return this.readString()
        if (isDigit(chr)) return this.readNumber()
        if (chr === "(") {
            this.inputStream.next()
            return right(new OpenParenthesisToken(line, col))
        }
        if (chr === ")") {
            this.inputStream.next()
            return right(new CloseParenthesisToken(line, col))
        }
        if (isUnOperatorStart(chr)) return this.readOperator(UnOperator)
        if (isBinOperatorStart(chr)) return this.readOperator(BinOperator)

        if (isSymbolStart(chr)) return this.readSymbol()

        return left(this.inputStream.croak("Unknown token"))
    }

    peek(): Either<string, Token> {
        if (this.current != null)
            return this.current

        this.current = this.readNext()
        return this.current
    }

    next(): Either<string, Token> {
        let aux = this.current
        this.current = null
        return aux ?? this.readNext()
    }

    eof(): boolean {
        return this.inputStream.eof()
    }

}




