# BrainScript Language

BrainScript is a new Lua-inspired, dynamically typed scripting language with explicit object-oriented programming, first-class functions, closures, modules, and familiar logic/control-flow constructs. This repository defines the language and its runtime roadmap.

> **Status:** early TypeScript interpreter prototype (v0.2.0). It includes executable syntax, functions, tables, classes, basic inheritance, runtime tests, a CLI, and an interactive REPL. It is not production-ready and should not be treated as a hardened sandbox.

## Design goals

- Lua-like readability, lightweight syntax, tables, and flexible functions.
- Object-oriented classes, constructors, methods, encapsulated fields, and single inheritance.
- Predictable logic and control flow: `if`, `while`, numeric and generic `for`, `break`, and `return`.
- First-class functions and lexical closures.
- Modules and package boundaries.
- A safe, embeddable runtime with explicit host capabilities.

## Example

```brain
module "game.entities"

class Entity {
    init(name, health = 100) {
        self.name = name
        self.health = health
    }

    method isAlive() {
        return self.health > 0
    }

    method damage(amount) {
        if amount < 0 {
            throw "damage must not be negative"
        }

        self.health = math.max(0, self.health - amount)
        return self.health
    }
}

class Player extends Entity {
    init(name, health = 100, level = 1) {
        super.init(name, health)
        self.level = level
        self.inventory = {}
    }

    method addItem(item) {
        table.insert(self.inventory, item)
    }
}

let player = Player("Astra", 120, 5)
player.damage(25)

if player.isAlive() {
    print(player.name .. " has " .. player.health .. " HP")
}
```

The example documents the intended language style. Check the runtime test suite and examples before assuming every planned language feature is implemented.

## Core syntax

| Feature | Proposed syntax |
| --- | --- |
| Variable | `let count = 0` |
| Mutable variable | `var count = 0` |
| Constant | `const MAX = 100` |
| Function | `fn add(a, b) { return a + b }` |
| Anonymous function | `let twice = fn(x) { return x * 2 }` |
| Conditional | `if ready { ... } else { ... }` |
| Loop | `while count < 10 { count = count + 1 }` |
| Numeric loop | `for i = 1, 10 { print(i) }` |
| Generic loop | `for key, value in pairs(data) { ... }` |
| Table | `let config = { title = "Demo", retries = 3 }` |
| Class | `class Enemy extends Entity { ... }` |
| Method | `method attack(target) { ... }` |
| Module | `module "game.combat"` |
| Error handling | `try { ... } catch err { ... }` |

## Language decisions

- **Types:** dynamic values initially: nil, boolean, number, string, table, function, class, instance, and native function.
- **Logic:** `and`, `or`, and `not` short-circuit. Only `false` and `nil` are falsey, matching Lua's convention.
- **String concatenation:** `..` to retain a Lua-like feel.
- **Tables:** map/array hybrid; keys are values, and missing entries evaluate to `nil`.
- **Functions:** first-class values with lexical closures.
- **Objects:** `class`, `extends`, `self`, `init`, and `super`; method dispatch is explicit in the language spec.
- **Errors:** structured runtime errors with source locations; `throw` and `try/catch`.
- **Interop:** host APIs must be registered explicitly; scripts do not gain arbitrary filesystem, network, or process access by default.

## Planned architecture

1. **Lexer** — tokenize identifiers, literals, operators, comments, and keywords.
2. **Parser** — produce an AST with source spans.
3. **Resolver** — validate scopes, declarations, and class relationships.
4. **Interpreter** — evaluate AST nodes with lexical environments and call frames.
5. **Object model** — tables, classes, instances, inheritance, bound methods, and constructors.
6. **Standard library** — math, string, table, iteration, and serialization utilities.
7. **CLI** — run scripts, evaluate snippets, and report readable diagnostics.
8. **Testing** — lexer/parser/runtime test suites and language conformance examples.

## Repository layout

- `docs/language-spec.md` — syntax, precedence, values, semantics, OOP model.
- `docs/roadmap.md` — implementation phases and acceptance criteria.
- `docs/security.md` — runtime capability and sandboxing model.
- `examples/` — representative scripts.
- `src/` — future reference interpreter.
- `tests/` — conformance suite.

## Name and scope

BrainScript is the language name for this repository. It is intended as an embeddable scripting language for AI tools, simulations, game logic, and automation. An interpreter, bytecode VM, debugger, and editor tooling are separate implementation milestones.


## Current implementation status

The repository now includes a TypeScript tokenizer, AST, parser, tree-walking interpreter, primitive/table values, function closures, a small standard library, class construction and method dispatch, a CLI, and runtime tests. The implementation is still a prototype: module loading, complete iteration, robust inheritance semantics, source-mapped runtime stack traces, and sandbox hardening remain future work. See [Implementation Status](docs/implementation-status.md).


## Run the prototype

Requirements: Node.js 20+ and npm.

```sh
npm install
npm test
npm run example
npm run repl
```

Run a script file directly:

```sh
npm run build
node dist/src/cli.js examples/hello.brain
```

REPL commands: `:help`, `:clear`, and `:quit`.

## Implemented vs planned

See [the runtime roadmap](docs/ROADMAP.md) and [implementation status](docs/implementation-status.md). Module loading and a proper iterator protocol are still planned. Generic `for ... in` currently iterates table entries; `pairs(table)` returns a table of two-element key/value pairs rather than implementing Lua's iterator protocol. Do not use this prototype as a security boundary for untrusted scripts.
