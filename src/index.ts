import { TofuInputStream } from "./inputstream"
import { TofuLexer } from "./lexer"


const str = "{meow undefined + == ! $asd ( )) \"moew\" 'ajdklasj'}"

let lexer = new TofuLexer(new TofuInputStream(str))

while (!lexer.eof()) {
    console.log(lexer.next())
}
