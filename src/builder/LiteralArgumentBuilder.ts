import { ArgumentBuilder, LiteralCommandNode } from "../internal";

export class LiteralArgumentBuilder extends ArgumentBuilder<LiteralArgumentBuilder> {
    private literal: string;

    constructor(literal: string) {
        super();
        this.literal = literal
    }

    getThis(): LiteralArgumentBuilder {
        return this;
    }

    getLiteral(): string {
        return this.literal;
    }
    
    build(): LiteralCommandNode {
        const result = new LiteralCommandNode(this.getLiteral(), this.getCommand());
        for (const argument of this.getArguments()) {
            result.addChild(argument);
        }
        return result;
    }
}

export function literal(name: string): LiteralArgumentBuilder {
    return new LiteralArgumentBuilder(name);
}
