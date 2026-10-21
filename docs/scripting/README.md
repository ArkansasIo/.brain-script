# BrainScript Scripting Guide

BrainScript is a Lua-inspired scripting language with its own syntax, semantics, object model, and runtime.

## Quick start

```brain
let name = "Nova"
var hp = 100

fn heal(amount) {
    hp = hp + amount
}

heal(25)
print(name .. " HP=" .. hp)
```

## Topics

- [Syntax](syntax.md)
- [Control flow](control-flow.md)
- [Functions and closures](functions.md)
- [Object-oriented programming](oop.md)
- [Modules](modules.md)
- [Library reference](../library/README.md)

## Runtime model

Programs are currently parsed into an AST and executed by a tree-walking interpreter. The eventual runtime is planned to support bytecode and a virtual machine while preserving the language-level contracts documented here.
