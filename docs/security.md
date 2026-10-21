# Security and Embedding Model

BrainScript is intended to be embeddable, but an interpreter is not automatically a security sandbox.

## Default posture

- The language core should not expose arbitrary shell execution, ambient filesystem access, unrestricted networking, or environment secrets.
- Host functionality should be provided only through explicit native functions/capabilities.
- Every native function must validate arguments and return structured errors.
- Module loading must use an explicit root allowlist and reject traversal outside approved directories.
- Execution should support an instruction budget, recursion limit, table/string size limits, and cancellation.
- Logs must redact secrets and avoid serializing arbitrary host objects.

## Untrusted scripts

Do not run untrusted scripts in a privileged process merely because they use a scripting language. For hostile multi-tenant use, combine language-level controls with operating-system or container isolation, CPU/memory limits, least privilege, and restricted network access.

## OOP and metaprogramming

The initial model intentionally does not include arbitrary native reflection, eval, dynamic code generation, monkey-patching of core prototypes, or unrestricted metatables. Any later metaprogramming features require a separate threat review.

## Plugin operations

A plugin should declare:
- capabilities it requires,
- valid argument/result schemas,
- whether it mutates state,
- time and memory limits,
- expected error behavior,
- tests for authorized and unauthorized calls.

Capabilities should be granted by the host, not by script code. The runtime should fail closed if a requested capability is absent.
