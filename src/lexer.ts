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
                number => right(new NumberToken(parseFloat(number))),
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
                str += chr
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
        return pipe(
            this.readEscaped(),
            match(
                err => left(err),
                text => right(new StringToken(text))
            )
        )
    }

    readSymbol(): Either<string, SymbolToken | KeywordToken> {
        return pipe(
            this.readWhile(isSymbolBody),
            match(
                err => left(err),
                tokenStr => isKeyword(tokenStr)
                    ? right(new KeywordToken(tokenStr as Keyword))
                    : right(new SymbolToken(tokenStr))
            )
        )
    }

    readOperator(operator: Object): Either<string, UnOperatorToken | BinOperatorToken> {
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
                    ? right(new BinOperatorToken(opStr as BinOperator))
                    : isUnOperator(opStr)
                        ? right(new UnOperatorToken(opStr as UnOperator))
                        : left(this.inputStream.croak(`Unknown operator "${opStr}"`))
            )
        )
    }


    readNext(): Either<string, Token> {
        let chr = this.inputStream.peek()
        if (chr === "{") {
            this.inputStream.next()
            return right(new OpenTemplateToken())
        }


        if (chr === "}") {
            this.inputStream.next()
            return right(new CloseTemplateToken())
        }

        let res = this.readWhile(isWhitespace);

        if (this.inputStream.eof())
            return left(this.inputStream.croak("Unexpected EOF"))
        chr = this.inputStream.peek()

        if (chr === '"') return this.readString()
        if (chr === "'") return this.readString()
        if (isDigit(chr)) return this.readNumber()
        if (chr === "(") {
            this.inputStream.next()
            return right(new OpenParenthesisToken())
        }
        if (chr === ")") {
            this.inputStream.next()
            return right(new CloseParenthesisToken())
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




