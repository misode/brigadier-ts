import {
    RootCommandNode,
    LiteralCommandNode,
    StringReader,
    LiteralArgumentBuilder,
    CommandContextBuilder,
    CommandNode,
    ParseResults,
    CommandSyntaxError,
    Suggestions,
    SuggestionsBuilder
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

        let result = 0;
        let successfulForks = 0;
        let forked = false;
        let foundCommand = false;
        const command = parse.getReader().getString();
        const original = parse.getContext().build(command);
        let contexts = [original];
        let next = [];

        while (contexts.length > 0) {
            const size = contexts.length;
            for (let i = 0; i < size; i++) {
                const context = contexts[i];
                const child = context.getChild();
                if (child !== null) {
                    forked = forked || context.isForked();
                    if (child.hasNodes()) {
                        foundCommand = true;
                        const modifier = context.getRedirectModifier();
                        if (modifier === null) {
                            next.push(child.copyFor(context.getSource()));
                        } else {
                            try {
                                const results = (<S[]> modifier(context));
                                results.forEach(source => {
                                    next.push(child.copyFor(source));
                                })
                            } catch (e) {
                                if (!forked) throw e;
                            }
                        }
                    }
                } else if (context.getCommand()) {
                    foundCommand = true;
                    try {
                        const value = context.getCommand()(context);
                        result += value ? value : 1;
                        successfulForks++;
                    } catch (e) {
                        console.log("!!!", e.message);
                        if (!forked) throw e;
                    }
                }
            }
            contexts = next;
            next = [];
        }

        if (!foundCommand) {
            throw CommandSyntaxError.DISPATCHER_UNKNOWN_COMMAND.createWithContext(parse.getReader());
        }
        return forked ? successfulForks : result;
    }

    parse(reader: StringReader | string, source: S): ParseResults<S> {
        reader = new StringReader(reader);
        const context = new CommandContextBuilder<S>(this, source, this.root, reader.getCursor());
        return this.parseNodes(this.root, reader, context);
    }

    private parseNodes(node: CommandNode<S>, originalReader: StringReader, contextSoFar: CommandContextBuilder<S>): ParseResults<S> {
        const source = contextSoFar.getSource();
        let potentials = [];

        for (const child of node.getRelevantNodes(originalReader)) {
            if (!child.canUse(source)) {
                continue;
            }
            const context = contextSoFar.copy();
            const reader = new StringReader(originalReader);

            try {
                child.parse(reader, context);
            } catch (e) {
                throw CommandSyntaxError.DISPATCHER_PARSE_ERROR.createWithContext(reader, e.message);
            }
            if (reader.canRead() && reader.peek() !== " ") {
                throw CommandSyntaxError.DISPATCHER_EXPECTED_ARGUMENT_SEPARATOR.createWithContext(reader);
            }
            context.withCommand(child.getCommand());

            if (reader.canRead(child.getRedirect() === null ? 2 : 1)) {
                reader.skip();
                if (child.getRedirect()) {
                    const childContext = new CommandContextBuilder<S>(this, source, child.getRedirect(), reader.getCursor());
                    const parse = this.parseNodes(child.getRedirect(), reader, childContext);
                    context.withChild(parse.getContext());
                    return new ParseResults<S>(context, parse.getReader());
                } else {
                    potentials.push(this.parseNodes(child, reader, context));
                }
            } else {
                potentials.push(new ParseResults(context, reader));
            }
        }
        if (potentials.length == 0) {
            potentials.push(new ParseResults(contextSoFar, originalReader));
        }
        return potentials[0];
    }

    getAllUsage(node: CommandNode<S>, source: S, restricted: boolean): String[] {
        const result = [];
        this.getAllUsageImpl(node, source, result, "", restricted);
        return result;
    }

    private getAllUsageImpl(node: CommandNode<S>, source: S, result: String[], prefix: string, restricted: boolean): void {
        if (restricted && !node.canUse(source)) {
            return;
        }

        if (node.getCommand() != null) {
            result.push(prefix);
        }

        if (node.getRedirect() != null) {
            const redirect = node.getRedirect() === this.root ? "..." : "->" + node.getRedirect().getUsageText();
            result.push(prefix.length === 0 ? node.getUsageText() + " " + redirect : prefix + " " + redirect);
        } else if (node.getChildren().length > 0) {
            for (const child of node.getChildren()) {
                const newPrefix = prefix.length === 0 ? child.getUsageText() : prefix + " " + child.getUsageText();
                this.getAllUsageImpl(child, source, result, newPrefix, restricted);
            }
        }
    }

    async getCompletionSuggestions(parse: ParseResults<S>, cursor?: number): Promise<Suggestions> {
        if (cursor === undefined) {
            cursor = parse.getReader().getTotalLength();
        }
        const context = parse.getContext();
        const nodeBeforeCursor = context.findSuggestionContext(cursor);
        const parent = nodeBeforeCursor.parent;
        const start = Math.min(nodeBeforeCursor.startPos, cursor);

        const fullInput = parse.getReader().getString();
        const truncatedInput = fullInput.substring(0, cursor);
        let promises: Promise<Suggestions>[] = [];
        for (const node of parent.getChildren()) {
            let promise = Suggestions.empty();
            try {
                console.log("!!!", promise);
                promise = node.listSuggestions(context.build(truncatedInput), new SuggestionsBuilder(truncatedInput, start));
            } catch(ignored) {
                console.log("???", ignored)
            }
            promises.push(promise);
        }
        const suggestions = await Promise.all(promises);
        return Suggestions.merge(fullInput, suggestions);
    }

    getRoot(): RootCommandNode<S> {
        return this.root;
    }
}
