import { CommandContext } from "./internal";

export type Command = (c: CommandContext) => number;
