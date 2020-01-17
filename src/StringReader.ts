export class StringReader {
    private string: string;
    private cursor: number;

    constructor(string: string | StringReader) {
        if (string instanceof StringReader) {
            this.string = string.getString();
            this.cursor = string.getCursor();
        } else {
            this.string = string;
            this.cursor = 0;
        }
    }

    getString(): string {
        return this.string;
    }

    getCursor(): number {
        return this.cursor;
    }

    setCursor(cursor: number): void {
        this.cursor = cursor;
    }

    getRemainingLength(): number {
        return this.string.length - this.cursor;
    }

    getTotalLength(): number {
        return this.string.length;
    }

    getRead(): string {
        return this.string.substring(0, this.cursor);
    }

    getRemaining(): string {
        return this.string.substring(this.cursor);
    }

    canRead(length = 1): boolean {
        return this.cursor + length <= this.string.length;
    }

    peek(offset = 0): string {
        return this.string.charAt(this.cursor + offset);
    }

    read(): string {
        const char =  this.string.charAt(this.cursor);
        this.cursor += 1;
        return char;
    }

    skip(): void {
        this.cursor += 1;
    }

    isAllowedNumber(c: string): boolean {
        return c >= "0" && c <= "9" || c === "." || c === "-";
    }

    readInt(): number {
        const start = this.cursor;
        while (this.canRead() && this.isAllowedNumber(this.peek())) {
            this.skip();
        }
        const number = this.string.substring(start, this.cursor);
        // TODO: Throw exceptions
        return parseInt(number);
    }

}
