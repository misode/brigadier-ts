import { CommandNode } from "../internal";

export class SuggestionContext<S> {
    parent: CommandNode<S>;
    startPos: number;

    constructor(parent: CommandNode<S>, startPos: number) {
        this.parent = parent;
        this.startPos = startPos;
    }
}
