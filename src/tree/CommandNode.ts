import {
    StringReader,
    Command,
    LiteralCommandNode,
    ArgumentCommandNode,
    CommandContextBuilder
} from '../internal';

export abstract class CommandNode<S> {
    private children: Map<string, CommandNode<S>>;
    private literals: Map<string, LiteralCommandNode<S>>;
    private arguments: Map<string, ArgumentCommandNode<S, any>>;
    private command: Command<S>;

    constructor(command: Command<S>) {
        this.children = new Map();
        this.literals = new Map();
        this.arguments = new Map();
        this.command = command;
    }

    getCommand(): Command<S> {
        return this.command;
    }

    getChildren(): CommandNode<S>[] {
        return Array.from(this.children.values());
    }

    addChild(node: CommandNode<S>): void {
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
            if (node instanceof LiteralCommandNode) {
                this.literals.set(node.getName(), node);
            } else if (node instanceof ArgumentCommandNode) {
                this.arguments.set(node.getName(), node);
            }
        }
    }

    abstract parse(reader: StringReader, context: CommandContextBuilder<S>): void;

    abstract getName(): string;

    abstract getUsageText(): string;

    getRelevantNodes(input: StringReader): CommandNode<S>[] {
        if (this.literals.size > 0) {
            const cursor = input.getCursor();
            while (input.canRead() && input.peek() != " ") {
                input.skip();
            }
            const text = input.getString().substring(cursor, input.getCursor());
            const literal = this.literals.get(text);
            if (literal != null) {
                return [literal];
            }
        }
        return Array.from(this.arguments.values());
    }
}
