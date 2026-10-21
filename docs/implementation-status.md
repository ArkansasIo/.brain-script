# Implementation Status

This repository is an early language prototype, not yet a complete runnable scripting language.

## Implemented in TypeScript

- Tokenizer for identifiers, keywords, numbers, strings, common operators, comments, and line/column tracking.
- AST declarations for variables, functions, classes, methods, tables, control flow, and expressions.
- Parser for a subset of declarations, expressions, blocks, if/elseif/else, loops, class syntax, table syntax, anonymous functions, and assignments.
- Initial lexer and parser tests.
- Language specification, examples, security principles, roadmap, and GitHub Actions repository checks.

## Not implemented yet

- AST interpreter / evaluator.
- Runtime values, tables, lexical environments, closures, and call frames.
- Class instantiation, constructor dispatch, method binding, and inheritance runtime.
- Complete error handling, iterator protocol, modules/imports, REPL, and CLI.
- A full compile/test pass against the checked-in sources.

The next engineering milestone is to make the TypeScript project compile and pass all tests, then implement and test the interpreter in small increments. The example `.brain` files are specification examples until an interpreter is available.