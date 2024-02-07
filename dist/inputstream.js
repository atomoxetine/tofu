"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TofuInputStream = void 0;
class TofuInputStream {
    pos;
    line;
    col;
    text;
    constructor(text) {
        this.text = text;
        this.line = 1;
        this.col = 1;
        this.pos = 0;
    }
    next() {
        let chr = this.text.charAt(this.pos++);
        if (chr == "\n") {
            this.line++;
            this.col = 1;
        }
        else {
            this.col++;
        }
        return chr;
    }
    peek() {
        return this.text.charAt(this.pos);
    }
    eof() {
        return this.text.charAt(this.pos) === "";
    }
    croak(err) {
        return `${err} at line ${this.line}, column ${this.col}`;
    }
}
exports.TofuInputStream = TofuInputStream;
