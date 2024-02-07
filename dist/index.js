"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inputstream_1 = require("./inputstream");
const lexer_1 = require("./lexer");
const str = "{meow + == ! $asd ( )) \"meow meow \n \\\\ \\\"  \" 'ajdklasj'}";
let lexer = new lexer_1.TofuLexer(new inputstream_1.TofuInputStream(str));
while (!lexer.eof()) {
    console.log(lexer.next());
}
