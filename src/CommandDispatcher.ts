import {
    RootCommandNode,
    LiteralCommandNode,
    StringReader,
    LiteralArgumentBuilder,
    CommandContextBuilder,
    CommandNode,
    ParseResults,
    CommandSyntaxError
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

        if (parse.getReader().canRead()) {
            if (parse.getContext().getRange().isEmpty()) {
                throw CommandSyntaxError.DISPATCHER_UNKNOWN_COMMAND.createWithContext(parse.getReader());
            } else {
                throw CommandSyntaxError.DISPATCHER_UNKNOWN_ARGUMENT.createWithContext(parse.getReader());
            }
        }

        const command = parse.getReader().getString();
        const context = parse.getContext().withSource(source).build(command);

        if (!context.getCommand()) {
            throw CommandSyntaxError.DISPATCHER_UNKNOWN_COMMAND.createWithContext(parse.getReader());
        }

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

            try {
                child.parse(reader, context);
            } catch (e) {
                throw CommandSyntaxError.DISPATCHER_PARSE_ERROR.createWithContext(reader, e.message);
            }
            if (reader.canRead() &&reader.peek() !== " ") {
                throw CommandSyntaxError.DISPATCHER_EXPECTED_ARGUMENT_SEPARATOR.createWithContext(reader);
            }
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
