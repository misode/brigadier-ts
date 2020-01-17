import {
    CommandNode,
    CommandDispatcher,
    Command,
    CommandContext,
    StringRange,
    ParsedCommandNode,
    ParsedArgument
} from "../internal";

export class CommandContextBuilder {
    private arguments: Map<string, ParsedArgument<any>>;
    private rootNode: CommandNode;
    private dispatcher: CommandDispatcher;
    private command: Command;
    private child: CommandContextBuilder;
    private range: StringRange;
    private nodes: ParsedCommandNode[];

    constructor(dispatcher: CommandDispatcher, rootNode: CommandNode, start: number) {
        this.dispatcher = dispatcher;
        this.rootNode = rootNode;
        this.range = StringRange.at(start);
        this.nodes = [];
        this.arguments = new Map();
    }

    getRootNode(): CommandNode {
        return this.rootNode;
    }

    withArgument(name: string, argument: ParsedArgument<any>): CommandContextBuilder {
        this.arguments.set(name, argument);
        return this;
    }

    getArguments(): Map<string, ParsedArgument<any>> {
        return this.arguments;
    }

    withChild(child: CommandContextBuilder): CommandContextBuilder {
        this.child = child;
        return this;
    }

    getChild(): CommandContextBuilder {
        return this.child;
    }

    getLastChild(): CommandContextBuilder {
        let result: CommandContextBuilder = this;
        while (result.getChild() != null) {
            result = result.getChild();
        }
        return result;
    }

    withCommand(command: Command): CommandContextBuilder {
        this.command = command;
        return this;
    }

    getCommand(): Command {
        return this.command;
    }

    withNode(node: CommandNode, range: StringRange): CommandContextBuilder {
        this.nodes.push(new ParsedCommandNode(node, range));
        this.range = StringRange.encompassing(this.range, range);
        return this;
    }

    getNodes(): ParsedCommandNode[] {
        return this.nodes;
    }

    copy(): CommandContextBuilder {
        const copy = new CommandContextBuilder(this.dispatcher, this.rootNode, this.range.getStart());
        copy.command = this.command;
        copy.child = this.child;
        copy.range = this.range;
        copy.nodes.push(...this.nodes);
        this.arguments.forEach((v, k) => {
            copy.arguments.set(k, v);
        });
        return copy;

    }

    build(input: string): CommandContext {
        const child = this.child == null ? null : this.child.build(input);
        return new CommandContext(this.arguments, this.command, this.rootNode, child, this.range);
    }

    getDispatcher(): CommandDispatcher {
        return this.dispatcher;
    }

    getRange(): StringRange {
        return this.range;
    }
}
