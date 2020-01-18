import { CommandNode, StringReader, CommandContextBuilder } from '../internal';

export class RootCommandNode<S> extends CommandNode<S> {

    constructor() {
        super(null);
    }

    parse(reader: StringReader, contextBuilder: CommandContextBuilder<S>): void {
    }

    getName(): string {
        return "";
    }

    getUsageText(): string {
        return "";
    }
}
