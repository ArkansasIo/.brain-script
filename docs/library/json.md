# JSON Library

> **Status:** Planned.

The future `json` module will convert between JSON documents and BrainScript values.

## Proposed API

- `json.encode(value)`
- `json.decode(text)`

JSON objects map to BrainScript tables. JSON arrays map to contiguous numeric table sequences. `nil`, booleans, numbers, and strings map directly.

Non-JSON values such as functions, classes, instances, and native handles must be rejected unless an explicit serialization protocol is introduced.
