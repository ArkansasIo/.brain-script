# Implementation Status

BrainScript is an early interpreter prototype. Its current build and test suite pass on the main branch (see the GitHub Actions workflow).

## Implemented

- TypeScript lexer/tokenizer with source coordinates, comments, strings and escapes.
- AST and parser for variable declarations, expressions, functions, tables, conditions, loops, classes, methods, assignment, and try/catch syntax.
- Tree-walking interpreter for arithmetic, comparisons, truthiness, short-circuit logic, branches, while/numeric loops, functions, closures, table values, member access and assignment.
- Basic class construction, bound instance methods, single inheritance, parent constructor invocation, and a minimal parent-method path.
- Small standard library surface: print, type, math helpers, table insert/remove, string lower/upper/length.
- CLI, examples, unit tests, TypeScript build, and GitHub Actions CI.

## Limitations to address next

- The interpreter is not yet a drop-in Lua implementation and syntax/semantics are intentionally distinct.
- Generic iteration is minimal; `pairs` currently returns a table of key/value pairs rather than a full Lua iterator protocol.
- Class field default expressions and complex parent dispatch need broader conformance tests.
- Module declarations are parsed but module importing/loading is not implemented.
- Runtime errors do not yet preserve complete source spans and stack traces through calls.
- The runtime's safeguards are useful development limits, not a hardened multi-tenant sandbox.
- No bytecode compiler, debugger, REPL, formatter, or VS Code language server yet.

## Next milestone

Expand runtime conformance tests, verify field initialization and inheritance edge cases, add a proper iterator protocol and module resolver, then improve diagnostics and IDE tooling.
