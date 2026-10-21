# BrainScript Design Documentation

This directory describes the architecture and design constraints for the complete BrainScript platform.

## Documents

- [Language design](language-design.md)
- [Runtime architecture](runtime-architecture.md)
- [Standard-library design](stdlib-design.md)
- [Module and package design](module-design.md)
- [AI runtime design](ai-runtime.md)
- [Tooling and IDE design](tooling.md)

## Platform layers

```text
BrainScript Source
       |
       v
Lexer -> Parser -> AST -> Semantic Analysis
                         |
             +-----------+-----------+
             |                       |
        Interpreter             Bytecode Compiler
             |                       |
             +-----------+-----------+
                         v
                    Runtime / VM
                         |
          +--------------+--------------+
          |              |              |
       Stdlib        Capabilities     Debug API
          |              |              |
          +--------------+--------------+
                         v
                  Host Application
```

The tree-walking interpreter is the current implementation. The VM is a planned compatibility-preserving runtime optimization.
