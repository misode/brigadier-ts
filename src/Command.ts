import { CommandContext } from ".";

export type Command<S> = (c: CommandContext<S>) => number | void;
