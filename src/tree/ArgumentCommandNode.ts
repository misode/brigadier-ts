import {
    ArgumentType,
    CommandNode,
    StringReader,
    Command,
    CommandContextBuilder
} from '../internal';
import { ParsedArgument } from '../context/ParsedArgument';

export class ArgumentCommandNode<T> extends CommandNode {
    name: string;
    type: ArgumentType<T>;

    constructor(name: string, type: ArgumentType<T>, command: Command) {
        super(command);
        this.name = name;
        this.type = type;
    }

    getType(): ArgumentType<T> {
        return this.type;
    }

    parse(reader: StringReader, contextBuilder: CommandContextBuilder): void {
        const start = reader.getCursor();
        const result = this.type.parse(reader);
        const parsed = new ParsedArgument<T>(start, reader.getCursor(), result);
        contextBuilder.withArgument(this.name, parsed);
        contextBuilder.withNode(this, parsed.getRange());
    }
    
    getName(): string {
        return this.name;
    }

    getUsageText(): string {
        return "<" + this.name + ">";
    }
}
