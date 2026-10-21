# Runtime Architecture

## Current runtime

```text
Source
  |
Lexer
  |
Token stream
  |
Parser
  |
AST
  |
Tree-walking Interpreter
  |
Environment / Values / Host Functions
```

The interpreter currently provides execution budgets and call-depth limits suitable for development safety.

## Target runtime

```text
Source
  |
Lexer
  |
Parser
  |
AST
  |
Semantic Analyzer
  |
Bytecode Compiler
  |
Bytecode
  |
Virtual Machine
  |
+-------------------+
| Runtime Services  |
| GC / Calls /      |
| Exceptions /      |
| Coroutines /      |
| Debug Metadata    |
+-------------------+
```

## VM requirements

The VM should preserve observable language semantics, support source locations, expose stack frames for debugging, and enforce instruction/resource budgets.

## Value representation

The current implementation uses explicit runtime classes for functions, native functions, bound methods, classes, instances, and tables. A future VM can replace these representations internally as long as public semantics remain stable.
