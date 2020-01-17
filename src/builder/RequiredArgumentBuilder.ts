import { ArgumentBuilder, LiteralCommandNode } from "../internal";
import { ArgumentType } from "../arguments/ArgumentType";
import { ArgumentCommandNode } from "../tree/ArgumentCommandNode";

export class RequiredArgumentBuilder<T> extends ArgumentBuilder<RequiredArgumentBuilder<T>> {
    private name: string;
    private type: ArgumentType<T>;

    constructor(name: string, type: ArgumentType<T>) {
        super();
        this.name = name;
        this.type = type;
    }

    getThis(): RequiredArgumentBuilder<T> {
        return this;
    }

    getName(): string {
        return this.name;
    }

    getType(): ArgumentType<T> {
        return this.type;
    }
    
    build(): ArgumentCommandNode<T> {
        const result = new ArgumentCommandNode(this.getName(), this.getType(), this.getCommand())
        for (const argument of this.getArguments()) {
            result.addChild(argument);
        }
        return result;
    }
}

export function argument(name: string, type: ArgumentType<any>): RequiredArgumentBuilder<any> {
    return new RequiredArgumentBuilder<any>(name, type);
}
