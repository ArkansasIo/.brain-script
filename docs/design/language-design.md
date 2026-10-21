# Language Design

## Goals

BrainScript is designed to be:

- Readable for game and application scripting.
- Familiar to Lua users without claiming Lua compatibility.
- Object-oriented without requiring class syntax for every program.
- Small enough for embedded runtimes.
- Extensible toward AI-agent programming.
- Deterministic when executed without host capabilities.

## Core semantic model

The language uses lexical environments, first-class functions, tables, classes, instances, and explicit mutation through `var` bindings or object/table assignment.

## Truthiness

`nil` and `false` are falsey. Other values are truthy.

## Equality

Current equality is identity/value equality at the runtime-value level. Tables, functions, classes, and instances are not structurally equal by default.

## Compatibility policy

Language changes must update the lexer, parser, runtime, tests, language specification, examples, and documentation together. A feature is not considered stable until executable tests exist.

## Evolution

The syntax is intentionally conservative. New syntax should solve a demonstrated language or tooling problem rather than copying Lua, Python, JavaScript, or another language wholesale.
