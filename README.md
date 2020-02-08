# Brigadier-ts
TypeScript port of [Mojang/brigadier](https://github.com/Mojang/brigadier)

## Installation
```
npm install brigadier-ts
```

## Usage
Example using a command source
```js
import {
    CommandDispatcher,
    IntegerArgumentType,
    literal,
    argument
} from "brigadier-ts";

class CommandSource {
    private a: number;
    constructor(a: number) {
        this.a = a;
    }
    getA(): number {
        return this.a;
    }
}

const dispatcher = new CommandDispatcher<CommandSource>();
dispatcher.register(literal("random")
    .executes(c => 4)
);
dispatcher.register(literal("double")
    .then(argument("value", new IntegerArgumentType())
        .executes(c => 2 * c.get("value"))
    )
);
dispatcher.register(literal("add")
    .executes(c => 4 + c.getSource().getA())
);

console.log(dispatcher.execute("random", null)); // 4
console.log(dispatcher.execute("double 3", null)); // 6
console.log(dispatcher.execute("add", new CommandSource(3))); // 7
```

Example using redirection and forking
```ts
import {
    CommandDispatcher,
    IntegerArgumentType,
    literal,
    argument
} from "brigadier-ts";

const dispatcher = new CommandDispatcher<number>();
const execute = dispatcher.register(literal("execute"));

dispatcher.register(literal("execute")
    .then(literal("run")
        .redirect(dispatcher.getRoot())
    )
    .then(literal("enumerate")
        .then(argument("nums", integer())
            .fork(execute, c => {
                let list: number[] = [];
                for (let i = c.get("nums"); i > 0; i--) {
                    list.push(i);
                }
                return list;
            })
        )
    )
);

dispatcher.register(literal("say")
    .executes(c => {
        console.log(c.getSource());
    })
)

console.log(dispatcher.execute("execute enumerate 5 run say", 0));
```
