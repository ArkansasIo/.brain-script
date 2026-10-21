# BrainScript Language Specification (Draft 0.1)

This document describes the proposed language. Tokens and semantics may change before a stable 1.0 release.

## 1. Lexical rules

Source is UTF-8. Identifiers begin with a letter or underscore and continue with letters, digits, or underscores. Keywords are reserved. Whitespace is insignificant outside strings. A line comment starts with `--`; block comments use `--[[ ... ]]`.

Supported literals: `nil`, `true`, `false`, decimal numbers, quoted strings, and table constructors.

## 2. Keywords

`and break catch class const continue do else elseif end extends false for fn function if in init let local method module nil not or return self super then throw true try var while`

The implementation may accept Lua-compatible `function` as an alias for `fn` and `local` as an alias for `let`.

## 3. Grammar sketch

The following EBNF is illustrative. The parser implementation is authoritative once one exists.

```ebnf
program       = { declaration | statement } ;
declaration   = moduleDecl | classDecl | functionDecl | variableDecl ;
moduleDecl    = "module" string ;
classDecl     = "class" identifier [ "extends" expression ] "{" { classMember } "}" ;
classMember   = "init" parameters block
              | "method" identifier parameters block
              | variableDecl ;
functionDecl  = ("fn" | "function") identifier parameters block ;
variableDecl  = ("let" | "var" | "const" | "local") identifier [ "=" expression ] ;
parameters    = "(" [ identifier { "," identifier } ] ")" ;
block         = "{" { declaration | statement } "}" ;
statement     = block | ifStmt | whileStmt | forStmt | returnStmt
              | breakStmt | continueStmt | tryStmt | throwStmt | expressionStmt ;
ifStmt        = "if" expression block { "elseif" expression block } [ "else" block ] ;
whileStmt     = "while" expression block ;
forStmt       = "for" identifier "=" expression "," expression [ "," expression ] block
              | "for" identifier { "," identifier } "in" expression block ;
returnStmt    = "return" [ expression ] ;
tryStmt       = "try" block "catch" identifier block ;
throwStmt     = "throw" expression ;
expressionStmt = expression ;
```

## 4. Variables and scopes

- `let` declares a block-scoped binding that cannot be reassigned after initialization.
- `var` declares a mutable block-scoped binding.
- `const` declares a named constant; reassignment is an error.
- `local` is an optional Lua-compatibility alias for `let` in the initial draft.
- A variable must be declared before it is assigned. Reads of unknown identifiers are errors.
- Functions close over lexical environments, not dynamic caller environments.
- Shadowing is permitted in nested blocks but duplicate declarations in the same block are errors.

## 5. Values and truthiness

Runtime value types: `nil`, boolean, number, string, table, function, class, instance, and native function.

Falsey values are only `false` and `nil`; zero and empty strings are truthy. Logical operators return one of their operands and short-circuit.

## 6. Expressions and operators

From highest to lowest precedence:

1. Grouping, call, property access (`.`), index (`[]`), method call.
2. Unary `-`, `not`, `#`.
3. Exponentiation `^` (right associative).
4. Multiplication, division, modulo: `*`, `/`, `%`.
5. Addition and subtraction: `+`, `-`.
6. Concatenation: `..` (right associative).
7. Comparisons: `<`, `<=`, `>`, `>=`.
8. Equality: `==`, `~=` (and `!=` as an optional alias).
9. Logical `and`.
10. Logical `or`.

Assignment is a statement, not a value-producing expression, in this draft. Comparisons between unlike non-numeric types should raise a clear runtime error unless equality is defined for those values.

## 7. Tables

Tables combine sequence and dictionary behavior:

```brain
let inventory = {
    "health_potion" = 3,
    armor = "Aegis",
    1 = "key",
    2 = "map"
}
inventory.armor = "Celestial Aegis"
inventory["health_potion"] = inventory["health_potion"] - 1
```

Property syntax `table.name` is shorthand for `table["name"]`. Reading a missing key returns `nil`. Assigning `nil` removes a key. Tables are reference values; assignment copies the reference, not the table.

## 8. Functions and closures

Functions are first-class values and may be named or anonymous:

```brain
fn makeCounter(start = 0) {
    var count = start
    return fn() {
        count = count + 1
        return count
    }
}

let nextId = makeCounter(100)
print(nextId()) -- 101
print(nextId()) -- 102
```

Default arguments are evaluated at call time in the callee's parameter environment. The runtime must verify arity and issue source-located errors.

## 9. Object-oriented model

### Classes and instances

```brain
class Actor {
    init(name) {
        self.name = name
    }

    method describe() {
        return "Actor: " .. self.name
    }
}

class NPC extends Actor {
    init(name, dialogue) {
        super.init(name)
        self.dialogue = dialogue
    }

    method speak() {
        return self.dialogue
    }
}
```

- Calling a class constructs an instance and invokes `init` if present.
- `self` refers to the current instance in a method.
- `super.method(...)` calls the parent class implementation.
- The initial draft supports one base class; multiple inheritance is out of scope.
- Instance fields are dynamic table-like properties.
- Method lookup checks the instance's class, then its parent chain.
- Methods are bound to their receiver when accessed through an instance.
- Field names may shadow methods on an instance; this behavior must be documented and tested.
- Class inheritance cycles and invalid superclass values are errors.
- Visibility modifiers are deferred; the first version uses public members.

## 10. Control flow

```brain
if score >= 90 {
    print("A")
} elseif score >= 80 {
    print("B")
} else {
    print("Keep practicing")
}

var i = 0
while i < 10 {
    i = i + 1
    if i == 3 { continue }
    if i == 8 { break }
}

for n = 1, 10, 2 {
    print(n)
}

for key, value in pairs(inventory) {
    print(key, value)
}
```

Numeric loops are inclusive at the upper bound. The step defaults to 1 and cannot be zero. Generic iteration is defined through a built-in iterator protocol, initially `pairs(table)` and `ipairs(table)`.

## 11. Modules

A source file may declare `module "path.name"`. Import syntax is expected to be `import "path.name"` in a follow-up revision; module loading must be host-configured and constrained to approved roots. Cycles should be detected or resolved with a documented loading state.

## 12. Errors

`throw value` raises a runtime error. `try { ... } catch err { ... }` catches language runtime errors and binds a structured error to `err`. Errors carry message, source file, line, column, and stack frames where available. Catch blocks must not swallow process-level failures or resource exhaustion.

## 13. Standard library

The starter library is planned to include:

- `math`: numeric helpers.
- `string`: splitting, casing, search, formatting.
- `table`: insert, remove, sort, keys.
- `pairs` and `ipairs`: table iteration.
- `print`: host-configurable output.
- `type`: runtime type introspection.

Filesystem, network, process, environment, and model APIs are not part of the default core library. Embedders may enable reviewed capabilities explicitly.

## 14. Compatibility

BrainScript borrows familiar ideas from Lua but is its own language. It does not promise source compatibility with Lua. Braces delimit blocks, `..` concatenates strings, and `nil` denotes absence. The interpreter's conformance tests will define the precise behavior.
