# Implementation Roadmap

## Phase 0 — Specification and repository foundation

- [x] Define project goals and language identity.
- [x] Draft grammar, value types, control flow, table behavior, and class semantics.
- [x] Define default-deny host capability philosophy.
- [ ] Freeze syntax for 0.1 after parser tests.

## Phase 1 — Front end

- [ ] Source span and token data structures.
- [ ] Lexer for literals, comments, operators, and keywords.
- [ ] Parser for expressions, declarations, blocks, loops, and classes.
- [ ] Clear parse diagnostics with line and column.
- [ ] Parser conformance examples and negative tests.

Acceptance: valid examples parse to stable AST nodes; malformed syntax reports actionable source locations.

## Phase 2 — Core interpreter

- [ ] Values and lexical environment.
- [ ] Variable declaration and assignment rules.
- [ ] Arithmetic, comparison, equality, truthiness, and short-circuit logic.
- [ ] Branches, loops, return, break, and continue.
- [ ] Functions, closures, argument defaults, and stack traces.
- [ ] Resource limits for instruction count and recursion.

Acceptance: examples can execute deterministically without host capabilities.

## Phase 3 — Lua-like tables and standard library

- [ ] Table construction and indexing.
- [ ] Property shorthand and nil deletion.
- [ ] Iterators and numeric loops.
- [ ] math, string, table, type, print.
- [ ] Test aliasing and insertion/removal edge cases.

## Phase 4 — Object-oriented system

- [ ] Classes, instances, constructors, bound methods.
- [ ] Single inheritance and super dispatch.
- [ ] Property and method lookup.
- [ ] Error cases: invalid parent, missing init, inheritance cycle.
- [ ] OOP examples and golden tests.

## Phase 5 — Modules and host API

- [ ] Module resolver constrained to configured paths.
- [ ] Module cache and cycle handling.
- [ ] Native-function registration with capability declarations.
- [ ] Host API contracts and permission checks.
- [ ] Module tests across nested directories.

## Phase 6 — Developer experience

- [ ] CLI: run file, syntax-check, print AST.
- [ ] REPL with recoverable syntax errors.
- [ ] VS Code syntax highlighting and snippets.
- [ ] Formatter and language-server prototype.
- [ ] Debugger hooks and structured execution traces.

## Phase 7 — Stabilization

- [ ] Versioned language conformance suite.
- [ ] Fuzz tests for lexer/parser and malformed inputs.
- [ ] Benchmarks against representative scripts.
- [ ] Threat model review for embeddings.
- [ ] Version 1.0 compatibility policy and release process.

## Release criteria

Do not describe the language as production-ready until core semantics are implemented and tested, security/resource limits are documented, examples execute end to end, and CI runs the full conformance suite.
