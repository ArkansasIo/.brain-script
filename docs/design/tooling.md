# Developer Tooling Design

## CLI

The CLI supports running `.brain` files and starting the REPL.

## Formatter

A future formatter should produce canonical whitespace and brace layout without changing semantics.

## Linter

The linter should detect unused bindings, unreachable code, suspicious mutation, invalid module references, and unsafe capability requests.

## Language Server

The future LSP should provide:

- Diagnostics
- Completion
- Hover documentation
- Go to definition
- Find references
- Symbol outline
- Rename
- Formatting

## Debugger

Debug metadata should map bytecode instructions back to source spans. The debugger should expose call stacks, locals, breakpoints, step execution, exception state, and runtime budgets.

## Documentation generator

Public classes, functions, fields, modules, and library APIs should be extractable into Markdown and machine-readable metadata.
