import {
    ArgumentType,
    CommandNode,
    StringReader,
    Command,
    CommandContextBuilder,
    Predicate,
    RedirectModifier
} from '../internal';
import { ParsedArgument } from '../context/ParsedArgument';

export class ArgumentCommandNode<S, T> extends CommandNode<S> {
    name: string;
    type: ArgumentType<T>;

    constructor(name: string, type: ArgumentType<T>, command: Command<S>, requirement: Predicate<S>, redirect: CommandNode<S>, modifier: RedirectModifier<S>, forks: boolean) {
        super(command, requirement, redirect, modifier, forks);
        this.name = name;
        this.type = type;
    }

    getType(): ArgumentType<T> {
        return this.type;
    }

    parse(reader: StringReader, contextBuilder: CommandContextBuilder<S>): void {
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
