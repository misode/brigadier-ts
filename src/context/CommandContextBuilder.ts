import {
    CommandNode,
    CommandDispatcher,
    Command,
    CommandContext,
    StringRange
} from "../internal";

export class CommandContextBuilder {
    private rootNode: CommandNode;
    private dispatcher: CommandDispatcher;
    private command: Command;
    private child: CommandContextBuilder;
    private range: StringRange;

    constructor(dispatcher: CommandDispatcher, rootNode: CommandNode, start: number) {
        this.dispatcher = dispatcher;
        this.rootNode = rootNode;
        this.range = StringRange.at(start);
    }

    getRootNode(): CommandNode {
        return this.rootNode;
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

    copy(): CommandContextBuilder {
        const copy = new CommandContextBuilder(this.dispatcher, this.rootNode, this.range.getStart());
        copy.command = this.command;
        copy.child = this.child;
        copy.range = this.range;
        return copy;

    }

    build(input: string): CommandContext {
        const child = this.child == null ? null : this.child.build(input);
        return new CommandContext(this.command, this.rootNode, child, this.range);
    }

    getDispatcher(): CommandDispatcher {
        return this.dispatcher;
    }

    getRange(): StringRange {
        return this.range;
    }
}
