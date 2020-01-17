import { Command,
    CommandNode,
    StringRange,
    ParsedArgument
} from "../internal";

export class CommandContext {
    private arguments: Map<string, ParsedArgument<any>>; 
    private command: Command;
    private rootNode: CommandNode;
    private child: CommandContext;
    private range: StringRange;

    constructor(parsedArguments: Map<string, ParsedArgument<any>>, command: Command, rootNode: CommandNode, child: CommandContext, range: StringRange) {
        this.arguments = parsedArguments;
        this.command = command;
        this.rootNode = rootNode;
        this.child = child;
        this.range = range;
    }

    getChild(): CommandContext {
        return this.child;
    }

    getLastChild(): CommandContext {
        let result: CommandContext = this;
        while (result.getChild() != null) {
            result = result.getChild();
        }
        return result;
    }

    getCommand(): Command {
        return this.command;
    }

    getRootNode(): CommandNode {
        return this.rootNode;
    }

    get(name: string): any {
        const argument = this.arguments.get(name);
        // TODO: Throw exception when argument is null
        return argument.getResult();
    }
}
