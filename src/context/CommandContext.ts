import { Command,
    CommandNode,
    StringRange,
    ParsedArgument
} from "../internal";

export class CommandContext<S> {
    private source: S;
    private arguments: Map<string, ParsedArgument<any>>; 
    private command: Command<S>;
    private rootNode: CommandNode<S>;
    private child: CommandContext<S>;
    private range: StringRange;

    constructor(source: S, parsedArguments: Map<string, ParsedArgument<any>>, command: Command<S>, rootNode: CommandNode<S>, child: CommandContext<S>, range: StringRange) {
        this.source = source;
        this.arguments = parsedArguments;
        this.command = command;
        this.rootNode = rootNode;
        this.child = child;
        this.range = range;
    }

    getChild(): CommandContext<S> {
        return this.child;
    }

    getLastChild(): CommandContext<S> {
        let result: CommandContext<S> = this;
        while (result.getChild() != null) {
            result = result.getChild();
        }
        return result;
    }

    getCommand(): Command<S> {
        return this.command;
    }

    getSource(): S {
        return this.source;
    }

    getRootNode(): CommandNode<S> {
        return this.rootNode;
    }

    get(name: string): any {
        const argument = this.arguments.get(name);
        // TODO: Throw exception when argument is null
        return argument.getResult();
    }
}
