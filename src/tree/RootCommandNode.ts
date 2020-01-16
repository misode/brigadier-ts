import { CommandNode } from '../internal';

export class RootCommandNode extends CommandNode {

    constructor() {
        super(null);
    }

    parse(): number {
        return -1;
    }

    getName(): string {
        return "";
    }

    getUsageText(): string {
        return "";
    }
}
