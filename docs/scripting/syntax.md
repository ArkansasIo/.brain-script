# Syntax Reference

## Variables

```brain
let immutable = 10
const constant = 20
var mutable = 30
```

`let` and `const` are immutable bindings in the current runtime. `var` creates a mutable binding.

## Values

BrainScript supports `nil`, booleans, numbers, strings, tables, functions, classes, and instances.

## Operators

- Arithmetic: `+ - * / // % ^`
- Comparison: `== ~= != < <= > >=`
- Logic: `and or not`
- Concatenation: `..`
- Length: `#`

## Assignment

```brain
hp = hp - 10
player.hp = 90
inventory[1] = "potion"
```

## Comments

Line comments begin with `//` according to the lexer implementation. Language documentation should be kept synchronized with lexer behavior as syntax evolves.

## Tables

```brain
let values = {10, 20, 30}
let profile = {name = "Nova", level = 10}
```
