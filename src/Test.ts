import {
    CommandDispatcher,
    literal,
    argument,
    integer,
    bool,
    word,
    string,
    greedyString
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
                })
        )
)

dispatcher.register(
    literal("say")
        .then(
            argument("message", greedyString())
                .executes(c => {
                    console.log("[Server]", c.get("message"));
                })
        )
)

dispatcher.register(
    literal("string")
        .then(
            literal("quoted")
                .then(
                    argument("string", string())
                        .executes(c => {
                            console.log("[@]", c.get("string"));
                        })
                )
        )
        .then(
            literal("unquoted")
                .then(
                    argument("string", word())
                        .executes(c => {
                            console.log("[@]", c.get("string"));
                        })
                )
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
console.log("Execute 'random'", dispatcher.execute("random"));
console.log("Execute 'boo'", dispatcher.execute("boo"));
console.log("Execute 'boo haha'", dispatcher.execute("boo haha"));
console.log("Execute 'double 3'", dispatcher.execute("double 3"));
console.log("Execute 'fly false'", dispatcher.execute("fly false"));
console.log("Execute 'say hello world'", dispatcher.execute("say hello world"));
console.log("Execute 'string unquoted hello-world'", dispatcher.execute("string unquoted hello-world"));
console.log("Execute 'string quoted \"Hello, world!\"'", dispatcher.execute("string quoted \"Hello, world!\""));
