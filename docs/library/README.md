# BrainScript Standard Library

The BrainScript standard library is designed around small, deterministic modules that are easy to expose to the interpreter, bytecode VM, REPL, and future AI runtime.

## Current modules

| Module | Status | Purpose |
|---|---|---|
| `core` | Implemented | `print`, `type` and core runtime helpers |
| `math` | Implemented | Numeric operations |
| `string` | Implemented | String normalization and length |
| `table` | Implemented | Table sequence operations |
| `agent` | Planned | AI-agent state, tools, events, and permissions |
| `json` | Planned | JSON encoding/decoding |
| `io` | Planned | Capability-controlled streams/files |
| `os` | Planned | Capability-controlled operating-system services |
| `coroutine` | Planned | Cooperative execution |

## Design rules

1. Library functions must validate arguments and fail with useful BrainScript errors.
2. Host capabilities must never be exposed implicitly to untrusted scripts.
3. APIs should be deterministic where practical.
4. Mutable state should be explicit.
5. Public library behavior belongs in documentation and executable tests.
6. Lua-inspired behavior is allowed, but BrainScript semantics are authoritative.

## Runtime tiers

- **Core:** always available.
- **Pure:** deterministic functions such as `math` and most `string` operations.
- **Stateful:** table and future coroutine APIs.
- **Capability:** `io`, `os`, networking, tools, and AI-agent APIs require explicit host capabilities.

See the individual module documents for the API contract and implementation status.
