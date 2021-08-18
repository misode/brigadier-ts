import { ArgumentType, StringReader, CommandErrorType } from "../internal";

export abstract class NumberArgumentType extends ArgumentType<number> {
    private minimum: number;
    private maximum: number;

    constructor(minimum: number, maximum: number) {
        super();
        this.minimum = minimum;
        this.maximum = maximum;
    }

    getMinimum(): number {
        return this.minimum;
    }

    getMaximum(): number {
        return this.maximum;
    }

    parse(reader: StringReader): number {
        const start = reader.getCursor();
        const result = this.readNumber(reader);
        if (result < this.minimum) {
            reader.setCursor(start);
            throw this.getTooSmallError().createWithContext(reader, result, this.minimum);
        } else if (result > this.maximum) {
            reader.setCursor(start);
            throw this.getTooBigError().createWithContext(reader, result, this.maximum);
        }
        return result;
    }

    abstract readNumber(reader: StringReader): number;

    abstract getTooSmallError(): CommandErrorType;

    abstract getTooBigError(): CommandErrorType;
}
