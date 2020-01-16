import { CommandContextBuilder, StringReader} from "./internal";

export class ParseResults {
    private context: CommandContextBuilder;
    private reader: StringReader;

    constructor(context: CommandContextBuilder, reader: StringReader) {
        this.context = context;
        this.reader = reader;
    }

    getContext(): CommandContextBuilder {
        return this.context;
    }

    getReader(): StringReader {
        return this.reader;
    }
}
