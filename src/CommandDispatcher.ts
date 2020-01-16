import {
    RootCommandNode,
    LiteralCommandNode,
    StringReader,
    LiteralArgumentBuilder,
    CommandContextBuilder,
    CommandNode,
    ParseResults
} from "./internal";

export class CommandDispatcher {

    private root: RootCommandNode;

    constructor() {
        this.root = new RootCommandNode();
    }

    register(command: LiteralArgumentBuilder): LiteralCommandNode {
        const build = command.build();
        this.root.addChild(build);
        return build;
    }

    execute(parse: ParseResults | string): number {
        if (typeof(parse) === "string") {
            parse = this.parse(new StringReader(parse));
        }
        let result = 0;
        const command = parse.getReader().getString();
        const original = parse.getContext().build(command);

        result = original.getCommand() ? original.getCommand().call(null) : -1;

        return result;
    }

    parse(reader: StringReader): ParseResults {
        const context = new CommandContextBuilder(this, this.root, reader.getCursor());
        return this.parseNodes(this.root, reader, context);
    }

    private parseNodes(node: CommandNode, originalReader: StringReader, contextSoFar: CommandContextBuilder): ParseResults {
        let potentials = [];

        for (const child of node.getRelevantNodes(originalReader)) {
            const context = contextSoFar.copy();
            const reader = new StringReader(originalReader);

            child.parse(reader, context);
            context.withCommand(child.getCommand());

            if (reader.canRead(2)) {
                reader.skip();
                potentials.push(this.parseNodes(child, reader, context));
            } else {
                potentials.push(new ParseResults(context, reader));
            }
        }
        if (potentials.length == 0) {
            potentials.push(new ParseResults(contextSoFar, originalReader));
        }
        return potentials[0];
    }

    getRoot(): RootCommandNode {
        return this.root;
    }
}
