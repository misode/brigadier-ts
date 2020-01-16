import {
    StringReader,
    Command,
    LiteralCommandNode,
    CommandContextBuilder
} from '../internal';

export abstract class CommandNode {
    private children: Map<string, CommandNode>;
    private command: Command;

    constructor(command: Command) {
        this.children = new Map();
        this.command = command;
    }

    getCommand(): Command {
        return this.command;
    }

    getChildren(): CommandNode[] {
        return Array.from(this.children.values());
    }

    addChild(node: CommandNode): void {
        const child = this.children.get(node.getName());
        if (child != null) {
            if (node.getCommand() != null) {
                child.command = node.getCommand();
            }
            node.getChildren().forEach((grandChild) => {
                child.addChild(grandChild);
            });
        } else {
            this.children.set(node.getName(), node);
        }
    }

    abstract parse(reader: StringReader, context: CommandContextBuilder): number;

    abstract getName(): string;

    abstract getUsageText(): string;

    getRelevantNodes(input: StringReader): CommandNode[] {
        if (this.children.size > 0) {
            const cursor = input.getCursor();
            while (input.canRead() && input.peek() != " ") {
                input.skip();
            }
            const text = input.getString().substring(cursor, input.getCursor());
            const literal = this.children.get(text);
            if (literal != null) {
                return [literal];
            }
        }
        return [];
    }
}
