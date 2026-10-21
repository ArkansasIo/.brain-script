# IO Library

> **Status:** Planned.

`io` is intended for capability-controlled streams rather than unrestricted filesystem access.

## Proposed API

- `io.open(path, mode)`
- `io.read(stream, size)`
- `io.write(stream, value)`
- `io.close(stream)`

## Security contract

A host must explicitly grant filesystem capabilities and allowed roots. Relative paths are resolved inside those roots. Scripts cannot request additional roots at runtime.

All operations should support limits and clear error reporting.
