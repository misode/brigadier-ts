export class StringRange {
    private start: number;
    private end: number;

    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }

    static at(pos: number): StringRange {
        return new StringRange(pos, pos);
    }

    getStart(): number {
        return this.start;
    }

    getEnd(): number {
        return this.end;
    }

    isEmpty(): boolean {
        return this.start === this.end;
    }

    getLength(): number {
        return this.end - this.start;
    }
}
