# BrainScript Roadmap

## Phase 1 — Core Language

- [x] Lexer/tokenizer
- [x] AST
- [x] Parser
- [x] Variables and expressions
- [x] Boolean logic
- [x] Functions and closures
- [x] Tables (keyed fields and positional entries)
- [x] Classes and methods
- [x] Single inheritance baseline
- [x] Exceptions baseline
- [x] Runtime test suite

## Phase 2 — Runtime

- [ ] Proper iterator protocol (current `pairs(table)` materializes key/value pairs and is not a Lua-compatible iterator triple)
- [ ] Module resolver/import system (module declarations currently fail clearly instead of silently doing nothing)
- [x] Instance field initialization follows base-to-derived order before constructor execution
- [ ] Constructor/field initializer semantics and inherited initializer conformance tests
- [ ] Complete `super` method dispatch across deeper inheritance chains
- [ ] Runtime stack traces with function call frames
- [ ] Source-span diagnostics for runtime errors
- [x] Interactive REPL with persistent state and working `:clear`

## Phase 3 — Language Platform

- [ ] Bytecode compiler
- [ ] Virtual machine
- [ ] Garbage-collection strategy
- [ ] Coroutines
- [ ] Async tasks
- [ ] Standard library expansion
- [ ] Package manager

## Phase 4 — AI Runtime

- [ ] Capability-based host API
- [ ] Sandboxed file access
- [ ] Sandboxed process/tool access
- [ ] Structured agent state
- [ ] Event/message system
- [ ] Agent memory API
- [ ] Deterministic execution mode
- [ ] Resource budgets

## Phase 5 — Developer Tools

- [ ] Formatter
- [ ] Linter
- [ ] Syntax highlighting
- [ ] VS Code extension
- [ ] Language Server Protocol implementation
- [ ] Debug adapter
- [ ] Interactive debugger
- [ ] Documentation generator

## Phase 6 — Production

- [ ] Compatibility test suite
- [ ] Security audit
- [ ] Performance benchmarks
- [ ] Stable language specification
- [ ] Versioned standard library
- [ ] Release packages

## Current implementation notes

The current runtime is a TypeScript tree-walking prototype. The test suite is the executable source of truth for implemented behavior. Features marked as planned are not promised to work yet. The runtime is not a hardened sandbox for untrusted programs.
