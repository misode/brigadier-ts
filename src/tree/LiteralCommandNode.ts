import { CommandNode, StringReader, Command } from '../internal';

export class LiteralCommandNode extends CommandNode {
    private literal: string;
    
    constructor(literal: string, command: Command) {
        super(command);
        this.literal = literal;
    }

    parse(reader: StringReader): number {
        const start = reader.getCursor();
        if (reader.canRead(this.literal.length)) {
            const end = start + this.literal.length;
            if (reader.getString().substring(start, end) === this.literal) {
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
