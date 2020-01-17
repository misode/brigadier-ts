import { StringReader } from "../internal";

export interface ArgumentType<T> {
    parse(reader: StringReader): T;
}
