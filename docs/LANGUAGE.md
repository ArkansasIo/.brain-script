# BrainScript Language Specification

BrainScript is a Lua-inspired, object-oriented scripting language for AI agents, games, automation, developer tools, and embedded runtimes.

## Variables

```brain
let name = "Nova"
var health = 100
const MAX_HEALTH = 100
```

`var` is mutable. `let` and `const` are protected from reassignment by the current runtime.

## Values

BrainScript supports `nil`, booleans, numbers, strings, tables, functions, classes, and instances.

## Operators

```text
+ - * / // % ^
== ~= != < <= > >=
and or not
..
#value
```

`..` concatenates values. `#` returns the length of a string or sequential table.

## Conditions

```brain
if health <= 0 {
    print("dead")
} elseif health < 25 {
    print("critical")
} else {
    print("healthy")
}
```

## Loops

```brain
for i = 1, 10 {
    print(i)
}

while health > 0 {
    health = health - 1
}

for key, value in data {
    print(key .. ":" .. value)
}
```

## Functions and closures

```brain
fn add(a, b) {
    return a + b
}

print(add(10, 20))
```

Functions are first-class values and retain their defining environment.

## Tables

```brain
let player = {
    name = "Nova",
    level = 10,
    hp = 250
}

print(player.name)
player.hp = 200
```

## Object-oriented programming

```brain
class Actor {
    init(name) {
        self.name = name
        self.hp = 100
    }

    method damage(amount) {
        self.hp = self.hp - amount
    }

    method alive() {
        return self.hp > 0
    }
}

let hero = Actor("Nova")
hero.damage(25)
print(hero.alive())
```

## Inheritance

```brain
class Enemy extends Actor {
    init(name) {
        super.init(name)
        self.hostile = true
    }
}
```

The current runtime supports classes, instances, bound methods, single inheritance, and parent constructor calls.

## Exceptions

```brain
try {
    throw "something went wrong"
} catch err {
    print("error=" .. err)
}
```

## Standard library

The current prototype provides `print`, `type`, `math.max`, `math.min`, `math.floor`, `math.ceil`, `math.abs`, `table.insert`, `table.remove`, `string.lower`, `string.upper`, and `string.len`.

## Roadmap

1. Module/import resolver.
2. Complete iterator protocol.
3. Lua-style metatables/prototypes alongside classes.
4. Coroutines and async tasks.
5. Bytecode compiler and virtual machine.
6. Capability-based sandbox API for AI agents.
7. Source-mapped stack traces and debugger.
8. Formatter and linter.
9. VS Code syntax highlighting and language server.
10. Package manager and signed modules.
