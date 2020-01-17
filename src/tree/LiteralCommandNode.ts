import { 
    CommandNode,
    StringReader,
    Command,
    StringRange,
    CommandContextBuilder
} from '../internal';

export class LiteralCommandNode extends CommandNode {
    private literal: string;
    
    constructor(literal: string, command: Command) {
        super(command);
        this.literal = literal;
    }

    parse(reader: StringReader, contextBuilder: CommandContextBuilder): void {
        const start = reader.getCursor();
        const end = this.parseInternal(reader);
        if (end > -1) {
            contextBuilder.withNode(this, new StringRange(start, end));
            return;
        }
        // TODO: Throw exception
    }

    private parseInternal(reader: StringReader): number {
        const start = reader.getCursor();
        if (reader.canRead(this.literal.length)) {
            const end = start + this.literal.length;
            if (reader.getString().substring(start, this.literal.length) === this.literal) {
                reader.setCursor(end);
                if (!reader.canRead() || reader.peek() == " ") {
                    return end;
                } else {
                    reader.setCursor(start);
                }
            }
        }
        return -1;
    }
    
    getName(): string {
        return this.literal;
    }

    getUsageText(): string {
        return this.literal;
    }
}
