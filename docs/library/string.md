# String Library

The current `string` table contains basic Unicode-aware JavaScript string operations.

## API

- `string.lower(value)` — lowercase representation.
- `string.upper(value)` — uppercase representation.
- `string.len(value)` — string length as reported by the runtime.

Example:

```brain
let name = string.upper("nova")
print(name)
```

## Planned additions

Substring, find, replace, split, join, trim, pattern matching, formatting, and interpolation should be specified before implementation. Pattern matching must not silently become an unsafe regular-expression execution surface.
