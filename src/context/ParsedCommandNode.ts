import { CommandNode, StringRange } from "../internal";

export class ParsedCommandNode {
    private node: CommandNode;
    private range: StringRange;
    
    constructor(node: CommandNode, range: StringRange) {
        this.node = node;
        this.range = range;
    }

    getNode(): CommandNode {
        return this.node;
    }

    getRange(): StringRange {
        return this.range;
    }
}
