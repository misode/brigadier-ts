import { ArgumentType, StringReader } from "../internal";
import { CommandSyntaxError } from "../exceptions/CommandSyntaxError";

export class IntegerArgumentType implements ArgumentType<number> {
    private minimum: number;
    private maximum: number;

    constructor(minimum: number, maximum: number) {
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
        const result = reader.readInt();
        if (result < this.minimum) {
            reader.setCursor(start);
            throw CommandSyntaxError.INTEGER_TOO_SMALL.createWithContext(reader, result, this.minimum);
        } else if (result > this.maximum) {
            reader.setCursor(start);
            throw CommandSyntaxError.INTEGER_TOO_BIG.createWithContext(reader, result, this.maximum);
        }
        return result;
    }
}

export function integer(minimum = -2147483648, maximum = 2147483647): IntegerArgumentType {
    return new IntegerArgumentType(minimum, maximum);
}
