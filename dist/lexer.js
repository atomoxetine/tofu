"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TofuLexer = void 0;
const token_1 = require("./token");
const Either_1 = require("fp-ts/Either");
const function_1 = require("fp-ts/function");
function isKeyword(x) {
    return token_1.keywords.indexOf(x) > -1;
}
function isUnOperator(x) {
    return token_1.unOperators.indexOf(x) > -1;
}
function isBinOperator(x) {
    return token_1.binOperators.indexOf(x) > -1;
}
function isDigit(chr) {
    return /[0-9]/i.test(chr);
}
function isWhitespace(chr) {
    return /[\s\t\n\r]/i.test(chr);
}
function isSymbolStart(chr) {
    return /[a-z\$_]/i.test(chr);
}
function isSymbolBody(chr) {
    return /[a-z\$_0-9]/i.test(chr);
}
function isUnOperatorStart(chr) {
    return token_1.unOperatorInitials.indexOf(chr) > -1;
}
function isBinOperatorStart(chr) {
    return token_1.binOperatorInitials.indexOf(chr) > -1;
}
class TofuLexer {
    inputStream;
    current = null;
    constructor(inputStream) {
        this.inputStream = inputStream;
    }
    readWhile(predicate) {
        let str = "";
        while (predicate(this.inputStream.peek())) {
            str += this.inputStream.next();
            if (this.inputStream.eof()) {
                return (0, Either_1.left)(this.inputStream.croak("Unexpected EOF"));
            }
        }
        if (str === "")
            return (0, Either_1.left)(this.inputStream.croak("Unmatched token"));
        return (0, Either_1.right)(str);
    }
    readNumber() {
        let hasDot = false;
        let err = null;
        let { line, col } = this.inputStream;
        col++;
        let numberRes = this.readWhile((chr) => {
            if (chr == ".") {
                if (hasDot) {
                    err = this.inputStream.croak("Unexpected .");
                    return false;
                }
                hasDot = true;
                return true;
            }
            return isDigit(chr);
        });
        if (err != null)
            return (0, Either_1.left)(err);
        return (0, function_1.pipe)(numberRes, (0, Either_1.match)(number => (0, Either_1.right)(new token_1.NumberToken(parseFloat(number), line, col)), err => (0, Either_1.left)(err)));
    }
    readEscaped() {
        let isEscaped = false, str = "";
        if (this.inputStream.eof())
            return (0, Either_1.left)(this.inputStream.croak("Unexpected EOF"));
        let end = this.inputStream.next();
        while (true) {
            if (this.inputStream.eof())
                return (0, Either_1.left)(this.inputStream.croak("Unexpected EOF"));
            let chr = this.inputStream.next();
            if (isEscaped) {
                str += chr;
                isEscaped = false;
            }
            else if (chr == "\\") {
                isEscaped = true;
            }
            else if (chr == end) {
                break;
            }
            else {
                str += chr;
            }
        }
        return (0, Either_1.right)(str);
    }
    readString() {
        let { line, col } = this.inputStream;
        col++;
        return (0, function_1.pipe)(this.readEscaped(), (0, Either_1.match)(err => (0, Either_1.left)(err), text => (0, Either_1.right)(new token_1.StringToken(text, line, col))));
    }
    readSymbol() {
        let { line, col } = this.inputStream;
        col++;
        return (0, function_1.pipe)(this.readWhile(isSymbolBody), (0, Either_1.match)(err => (0, Either_1.left)(err), tokenStr => isKeyword(tokenStr)
            ? (0, Either_1.right)(new token_1.KeywordToken(tokenStr, line, col))
            : (0, Either_1.right)(new token_1.SymbolToken(tokenStr, line, col))));
    }
    readOperator(operator) {
        let { line, col } = this.inputStream;
        col++;
        let remaining = Object.values(operator);
        let idx = 0;
        return (0, function_1.pipe)(this.readWhile((chr) => {
            if (remaining.length == 0)
                return false;
            let newRemaining = [];
            for (let op of remaining) {
                if (op.charAt(idx) != chr)
                    continue;
                newRemaining.push(op);
            }
            remaining = newRemaining;
            idx++;
            if (remaining.length == 0)
                return false;
            else
                return true;
        }), (0, Either_1.match)(err => (0, Either_1.left)(err), opStr => isBinOperator(opStr)
            ? (0, Either_1.right)(new token_1.BinOperatorToken(opStr, line, col))
            : isUnOperator(opStr)
                ? (0, Either_1.right)(new token_1.UnOperatorToken(opStr, line, col))
                : (0, Either_1.left)(this.inputStream.croak(`Unknown operator "${opStr}"`))));
    }
    readNext() {
        let { line, col } = this.inputStream;
        col++;
        let chr = this.inputStream.peek();
        if (chr === "{") {
            this.inputStream.next();
            return (0, Either_1.right)(new token_1.OpenTemplateToken(line, col));
        }
        if (chr === "}") {
            this.inputStream.next();
            return (0, Either_1.right)(new token_1.CloseTemplateToken(line, col));
        }
        let res = this.readWhile(isWhitespace);
        if (this.inputStream.eof())
            return (0, Either_1.left)(this.inputStream.croak("Unexpected EOF"));
        chr = this.inputStream.peek();
        if (chr === '"')
            return this.readString();
        if (chr === "'")
            return this.readString();
        if (isDigit(chr))
            return this.readNumber();
        if (chr === "(") {
            this.inputStream.next();
            return (0, Either_1.right)(new token_1.OpenParenthesisToken(line, col));
        }
        if (chr === ")") {
            this.inputStream.next();
            return (0, Either_1.right)(new token_1.CloseParenthesisToken(line, col));
        }
        if (isUnOperatorStart(chr))
            return this.readOperator(token_1.UnOperator);
        if (isBinOperatorStart(chr))
            return this.readOperator(token_1.BinOperator);
        if (isSymbolStart(chr))
            return this.readSymbol();
        return (0, Either_1.left)(this.inputStream.croak("Unknown token"));
    }
    peek() {
        if (this.current != null)
            return this.current;
        this.current = this.readNext();
        return this.current;
    }
    next() {
        let aux = this.current;
        this.current = null;
        return aux ?? this.readNext();
    }
    eof() {
        return this.inputStream.eof();
    }
}
exports.TofuLexer = TofuLexer;
