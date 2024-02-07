import { TofuInputStream } from "./inputstream"
import { TofuLexer } from "./lexer"


const str = "{meow + == ! $asd ( )) \"meow meow \\n \\\\ \\\"  \" 'ajdklasj'}"

let lexer = new TofuLexer(new TofuInputStream(str))

while (!lexer.eof()) {
    console.log(lexer.next())
}
