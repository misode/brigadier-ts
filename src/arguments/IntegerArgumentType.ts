import { ArgumentType, StringReader } from "../internal";

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
        // TODO: Throw exceptions when out of range
        return result;
    }
}

export function integer(minimum = -2147483648, maximum = 2147483647): IntegerArgumentType {
    return new IntegerArgumentType(minimum, maximum);
}
