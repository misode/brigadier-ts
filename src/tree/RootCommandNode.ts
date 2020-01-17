import { CommandNode, StringReader, CommandContextBuilder } from '../internal';

export class RootCommandNode extends CommandNode {

    constructor() {
        super(null);
    }

    parse(reader: StringReader, contextBuilder: CommandContextBuilder): void {
    }

    getName(): string {
        return "";
    }

    getUsageText(): string {
        return "";
    }
}
