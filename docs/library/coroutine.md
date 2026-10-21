# Coroutine Library

> **Status:** Planned.

Coroutines will provide cooperative execution without requiring operating-system threads.

## Proposed API

- `coroutine.create(function)`
- `coroutine.resume(handle, ...)`
- `coroutine.yield(...)`
- `coroutine.status(handle)`

The VM must preserve lexical environments across suspension and enforce runtime resource limits.

Coroutine behavior should be deterministic when no external capability is used.
