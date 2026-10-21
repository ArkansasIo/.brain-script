# Standard Library Design

## Principles

The standard library is divided into pure, stateful, and capability-controlled APIs.

### Pure

`math` and string operations should have predictable results and no host side effects.

### Stateful

`table`, iterators, and coroutines may mutate language-level state but should not access the host by default.

### Capability-controlled

Filesystem, process, network, environment, clock, randomness, and AI tools require explicit host capabilities.

## API shape

Functions should use a consistent validation strategy, return ordinary BrainScript values, and raise BrainScript runtime errors for invalid arguments.

## Versioning

Standard-library modules should have documented version contracts. Breaking changes should require a language/runtime major version or an explicitly versioned library namespace.

## Test strategy

Every public function should have tests for normal inputs, boundary values, wrong types, wrong arity, and failure behavior.
