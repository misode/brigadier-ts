import {
    RootCommandNode,
    LiteralCommandNode,
    StringReader,
    LiteralArgumentBuilder,
    CommandContextBuilder,
    CommandNode,
    ParseResults
} from "./internal";

export class CommandDispatcher<S> {

    private root: RootCommandNode<S>;

    constructor() {
        this.root = new RootCommandNode();
    }

    register(command: LiteralArgumentBuilder<S>): LiteralCommandNode<S> {
        const build = command.build();
        this.root.addChild(build);
        return build;
    }

    execute(parse: ParseResults<S> | string, source: S): number {
        if (typeof(parse) === "string") {
            parse = this.parse(new StringReader(parse), source);
        }
        const command = parse.getReader().getString();
        const context = parse.getContext().withSource(source).build(command);

        const result = context.getCommand() ? context.getCommand().call(null, context) : -1;
        if (!result) return 1;
        return result;
    }

    parse(reader: StringReader, source: S): ParseResults<S> {
        const context = new CommandContextBuilder<S>(this, source, this.root, reader.getCursor());
        return this.parseNodes(this.root, reader, context);
    }

    private parseNodes(node: CommandNode<S>, originalReader: StringReader, contextSoFar: CommandContextBuilder<S>): ParseResults<S> {
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

    getRoot(): RootCommandNode<S> {
        return this.root;
    }
}
