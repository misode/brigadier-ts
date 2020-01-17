import {
    CommandDispatcher,
    CommandContext,
    literal,
    argument,
    integer,
    bool
} from "./internal";

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

dispatcher.register(
    literal("fly")
        .then(
            argument("bool", bool())
                .executes(c => {
                    if (c.get("bool")) {
                        console.log("Flying enabled");
                    } else {
                        console.log("Flying disabled");
                    }
                    return 0;
                })
        )
)

console.log("--- Commands ---");
dispatcher.getRoot().getChildren().forEach(v => {
    console.log(v.getName());
    v.getChildren().forEach(w => {
        console.log(" ", w.getName());
    });
});

console.log();
console.log("Execute 'random'", dispatcher.execute("random"))
console.log("Execute 'boo'", dispatcher.execute("boo"))
console.log("Execute 'boo haha'", dispatcher.execute("boo haha"))
console.log("Execute 'double 3'", dispatcher.execute("double 3"))
console.log("Execute 'fly false'", dispatcher.execute("fly false"))
