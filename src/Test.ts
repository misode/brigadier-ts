import {
    CommandDispatcher,
    literal,
    StringReader
} from "./internal";

const dispatcher = new CommandDispatcher();
dispatcher.register(literal("random")
    .executes(() => 4)
)

dispatcher.register(
    literal("boo")
        .then(
            literal("haha")
                .executes(() => 9)
        )
        .executes(() => 0)
)

console.log("Root:", dispatcher.getRoot().getName());
dispatcher.getRoot().getChildren().forEach(v => {
    console.log("  Child:", v.getName(), v.getCommand() ? v.getCommand().call(null) : "");
    v.getChildren().forEach(w => {
        console.log("    Child:", w.getName(), w.getCommand() ? w.getCommand().call(null) : "");
    });
});

console.log();
console.log("Execute 'random'", dispatcher.execute("random"))
console.log("Execute 'boo'", dispatcher.execute("boo"))
console.log("Execute 'boo haha'", dispatcher.execute("boo haha"))
