import { CommandContextBuilder, StringReader} from "./internal";

export class ParseResults<S> {
    private context: CommandContextBuilder<S>;
    private reader: StringReader;

    constructor(context: CommandContextBuilder<S>, reader: StringReader) {
        this.context = context;
        this.reader = reader;
    }

    getContext(): CommandContextBuilder<S> {
        return this.context;
    }

    getReader(): StringReader {
        return this.reader;
    }
}
