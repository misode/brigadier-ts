# Brigadier-ts
TypeScript port of [Mojang/brigadier](https://github.com/Mojang/brigadier)

## Installation
```
npm install brigadier-ts
```

## Usage
```js
import {
    CommandDispatcher,
    literal,
    argument,
    integer
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
    .then(argument("value", integer())
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
