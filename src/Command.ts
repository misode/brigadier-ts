import { CommandContext } from "./internal";

export type Command<S> = (c: CommandContext<S>) => number | void;
