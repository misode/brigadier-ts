import { ArgumentType, StringReader, NumberArgumentType, CommandSyntaxError } from "../internal";

export class FloatArgumentType extends NumberArgumentType implements ArgumentType<number> {

    constructor(minimum = -Infinity, maximum = Infinity) {
        super(minimum, maximum);
    }

    readNumber(reader: StringReader): number {
        return reader.readFloat();
    }

    getTooSmallError() {
        return CommandSyntaxError.FLOAT_TOO_SMALL;
    }

    getTooBigError() {
        return CommandSyntaxError.FLOAT_TOO_BIG;
    }
}
