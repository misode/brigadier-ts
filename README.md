# Brigadier-ts
TypeScript port of [Mojang/brigadier](https://github.com/Mojang/brigadier)

## Installation
This project uses webpack to compile and bundle the code into `dist/brigadier.js`.
```
npm run build
```

## Usage
```js
const dispatcher = new CommandDispatcher();
dispatcher.register(literal("random")
    .executes(c => 4)
);
dispatcher.register(literal("double")
    .then(argument("value", integer())
        .executes(c => 2 * c.get("value"))
    )
);

console.log(dispatcher.execute("random")); // 4
console.log(dispatcher.execute("double 3")); // 6
```
