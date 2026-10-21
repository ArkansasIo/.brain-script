# OS Library

> **Status:** Planned and capability-controlled.

The `os` module is reserved for explicitly authorized host services such as environment queries, clocks, process metadata, and controlled process execution.

No OS operation should be available by default in a sandboxed BrainScript runtime.

## Proposed principles

- Explicit capability grants.
- Allowlisted operations.
- Argument validation.
- Timeouts for external operations.
- Output-size limits.
- Audit events for privileged calls.
