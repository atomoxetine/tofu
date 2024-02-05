export class TofuInputStream {
    pos: number
    line: number
    col: number
    text: string

    constructor(text: string) {
        this.text = text
        this.line = 1
        this.col = 1
        this.pos = 0
    }

    next(): string {
        let chr = this.text.charAt(this.pos++)
        if (chr == "\n") {
            this.line++
            this.col = 1
        } else {
            this.col++
        }
        return chr
    }

    peek(): string {
        return this.text.charAt(this.pos)
    }

    eof(): boolean {
        return this.text.charAt(this.pos) === ""
    }

    croak(err: string): string {
        return `${err} at line ${this.line}, column ${this.col}`
    }
}
