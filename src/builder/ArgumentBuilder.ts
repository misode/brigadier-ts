import { CommandNode, RootCommandNode, Command } from "../internal";

export abstract class ArgumentBuilder<T extends ArgumentBuilder<T>> {
    private arguments: RootCommandNode;
    private command: Command; 

    constructor() {
        this.arguments = new RootCommandNode();
    }

    abstract getThis(): T;

    then(argument: ArgumentBuilder<any> | CommandNode): T {
        const child = argument instanceof CommandNode ? argument : argument.build();
        this.arguments.addChild(child);
        return this.getThis();
    }

    executes(command: Command): T {
        this.command = command;
        return this.getThis();
    }

    getArguments(): CommandNode[] {
        return this.arguments.getChildren();
    }

    getCommand(): Command {
        return this.command;
    }

    abstract build(): CommandNode;
}
