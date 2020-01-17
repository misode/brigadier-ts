import {
    CommandDispatcher,
    literal,
    integer
} from "./internal";
import { argument } from "./builder/RequiredArgumentBuilder";
import { CommandContext } from "./context/CommandContext";

const dispatcher = new CommandDispatcher();
dispatcher.register(literal("random")
    .executes(c => 4)
)

dispatcher.register(
    literal("boo")
        .then(
            literal("haha")
                .executes(c => 9)
        )
        .executes(c => 0)
)

dispatcher.register(
    literal("double")
        .then(
            argument("value", integer())
                .executes(c => 2 * c.get("value"))
        )
)

console.log("Root:", dispatcher.getRoot().getName());
dispatcher.getRoot().getChildren().forEach(v => {
    console.log("  Child:", v.getName());
    v.getChildren().forEach(w => {
        console.log("    Child:", w.getName());
    });
});

console.log();
console.log("Execute 'random'", dispatcher.execute("random"))
console.log("Execute 'boo'", dispatcher.execute("boo"))
console.log("Execute 'boo haha'", dispatcher.execute("boo haha"))
console.log("Execute 'double 3'", dispatcher.execute("double 3"))
