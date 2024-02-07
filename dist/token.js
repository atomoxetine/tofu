"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinOperatorToken = exports.UnOperatorToken = exports.SymbolToken = exports.KeywordToken = exports.StringToken = exports.NumberToken = exports.CloseParenthesisToken = exports.OpenParenthesisToken = exports.CloseTemplateToken = exports.OpenTemplateToken = exports.Token = exports.binOperatorInitials = exports.binOperators = exports.BinOperator = exports.unOperatorInitials = exports.unOperators = exports.UnOperator = exports.keywords = exports.Keyword = void 0;
const utils_1 = require("./utils");
var Keyword;
(function (Keyword) {
    Keyword["PERIOD"] = ".";
    Keyword["NULL"] = "null";
    Keyword["UNDEFINED"] = "undefined";
})(Keyword || (exports.Keyword = Keyword = {}));
exports.keywords = (0, utils_1.objToValArray)(Keyword);
var UnOperator;
(function (UnOperator) {
    UnOperator["NOT"] = "!";
})(UnOperator || (exports.UnOperator = UnOperator = {}));
exports.unOperators = (0, utils_1.objToValArray)(UnOperator);
exports.unOperatorInitials = (0, utils_1.objToValInitials)(UnOperator);
var BinOperator;
(function (BinOperator) {
    BinOperator["LESS"] = "<";
    BinOperator["LESS_OR_EQUALS"] = "<=";
    BinOperator["SOFT_EQUALS"] = "==";
    BinOperator["HARD_EQUALS"] = "===";
    BinOperator["GREATER_OR_EQUALS"] = ">=";
    BinOperator["GREATER"] = ">";
    BinOperator["SOFT_NOT_EQUALS"] = "!=";
    BinOperator["HARD_NOT_EQUALS"] = "!==";
    BinOperator["AND"] = "&&";
    BinOperator["OR"] = "||";
    BinOperator["XOR"] = "^";
    BinOperator["NULLC"] = "??";
    BinOperator["ADD"] = "+";
    BinOperator["SUB"] = "-";
    BinOperator["MUL"] = "*";
    BinOperator["EXP"] = "**";
    BinOperator["DIV"] = "/";
    BinOperator["MOD"] = "%";
    // bitwise not implemented
})(BinOperator || (exports.BinOperator = BinOperator = {}));
exports.binOperators = (0, utils_1.objToValArray)(BinOperator);
exports.binOperatorInitials = (0, utils_1.objToValInitials)(BinOperator);
class Token {
    line;
    col;
    constructor(line, col) {
        this.line = line;
        this.col = col;
    }
}
exports.Token = Token;
class OpenTemplateToken extends Token {
}
exports.OpenTemplateToken = OpenTemplateToken;
class CloseTemplateToken extends Token {
}
exports.CloseTemplateToken = CloseTemplateToken;
class OpenParenthesisToken extends Token {
}
exports.OpenParenthesisToken = OpenParenthesisToken;
class CloseParenthesisToken extends Token {
}
exports.CloseParenthesisToken = CloseParenthesisToken;
class NumberToken extends Token {
    value;
    constructor(value, line, col) { super(line, col); this.value = value; }
}
exports.NumberToken = NumberToken;
class StringToken extends Token {
    value;
    constructor(value, line, col) { super(line, col); this.value = value; }
}
exports.StringToken = StringToken;
class KeywordToken extends Token {
    value;
    constructor(value, line, col) { super(line, col); this.value = value; }
}
exports.KeywordToken = KeywordToken;
class SymbolToken extends Token {
    value;
    constructor(value, line, col) { super(line, col); this.value = value; }
}
exports.SymbolToken = SymbolToken;
class UnOperatorToken extends Token {
    value;
    constructor(value, line, col) { super(line, col); this.value = value; }
}
exports.UnOperatorToken = UnOperatorToken;
class BinOperatorToken extends Token {
    value;
    constructor(value, line, col) { super(line, col); this.value = value; }
}
exports.BinOperatorToken = BinOperatorToken;
