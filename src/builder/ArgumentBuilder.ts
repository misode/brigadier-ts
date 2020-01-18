import { CommandNode, RootCommandNode, Command } from "../internal";

export abstract class ArgumentBuilder<S, T extends ArgumentBuilder<S, T>> {
    private arguments: RootCommandNode<S>;
    private command: Command<S>; 

    constructor() {
        this.arguments = new RootCommandNode();
    }

    abstract getThis(): T;

    then(argument: ArgumentBuilder<S, any> | CommandNode<S>): T {
        const child = argument instanceof CommandNode ? argument : argument.build();
        this.arguments.addChild(child);
        return this.getThis();
    }

    executes(command: Command<S>): T {
        this.command = command;
        return this.getThis();
    }

    getArguments(): CommandNode<S>[] {
        return this.arguments.getChildren();
    }

    getCommand(): Command<S> {
        return this.command;
    }

    abstract build(): CommandNode<S>;
}
