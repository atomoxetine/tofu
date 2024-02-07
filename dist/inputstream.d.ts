export declare class TofuInputStream {
    pos: number;
    line: number;
    col: number;
    text: string;
    constructor(text: string);
    next(): string;
    peek(): string;
    eof(): boolean;
    croak(err: string): string;
}
