import { ArgumentType, StringReader } from "../internal";

export class BoolArgumentType implements ArgumentType<boolean> {

    parse(reader: StringReader): boolean {
        return reader.readBoolean();
    }
}

export function bool(): BoolArgumentType {
    return new BoolArgumentType();
}
