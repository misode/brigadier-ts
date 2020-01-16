import { Command, CommandNode, StringRange } from "../internal";

export class CommandContext {
    private command: Command;
    private rootNode: CommandNode;
    private child: CommandContext;
    private range: StringRange;

    constructor(command: Command, rootNode: CommandNode, child: CommandContext, range: StringRange) {
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
}
