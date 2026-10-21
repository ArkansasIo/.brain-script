# Implementation Status

BrainScript is an early interpreter prototype. The recent table-constructor and class-field regression commits passed GitHub Actions; the newest documentation/runtime status commit is still being verified.

## Implemented

- TypeScript lexer/tokenizer with source coordinates, comments, strings and escapes.
- AST and parser for variable declarations, expressions, functions, tables, conditions, loops, classes, methods, assignment, and try/catch syntax.
- Tree-walking interpreter for arithmetic, comparisons, truthiness, short-circuit logic, branches, while/numeric loops, functions, closures, table values, member access and assignment.
- Basic class construction, bound instance methods, single inheritance, parent constructor invocation, and a minimal parent-method path.
- Small standard library surface: print, type, math helpers, table insert/remove, string lower/upper/length.
- CLI with script-file and REPL modes, examples, expanded runtime tests, TypeScript build, and GitHub Actions CI workflow.

## Limitations to address next

- The interpreter is not yet a drop-in Lua implementation and syntax/semantics are intentionally distinct.
- Generic iteration is minimal; `pairs` currently returns a table of key/value pairs rather than a full Lua iterator protocol.
- Class field defaults are evaluated base-to-derived before constructors, but complex parent dispatch and constructor semantics still need broader conformance tests.
- Module declarations are parsed but module importing/loading is not implemented; executing a module declaration now raises an explicit runtime error.
- Runtime errors do not yet preserve complete source spans and stack traces through calls.
- The runtime's safeguards are useful development limits, not a hardened multi-tenant sandbox.
- No bytecode compiler, debugger, formatter, or VS Code language server yet.

## Next milestone

Expand runtime conformance tests, verify field initialization and inheritance edge cases, add a proper iterator protocol and module resolver, then improve diagnostics and IDE tooling.
