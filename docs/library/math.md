# Math Library

The current `math` table provides numeric helpers.

## API

| Function | Arguments | Result |
|---|---|---|
| `math.max(...)` | numbers | largest value |
| `math.min(...)` | numbers | smallest value |
| `math.floor(x)` | number | floor of `x` |
| `math.ceil(x)` | number | ceiling of `x` |
| `math.abs(x)` | number | absolute value |

Example:

```brain
let damage = math.max(0, attack - armor)
print(math.floor(damage))
```

All current math functions reject non-finite or non-numeric arguments.

## Planned additions

`pow`, `sqrt`, `sin`, `cos`, `tan`, `log`, `exp`, random-number services with deterministic seeds, and constants such as `pi` should be added only with documented semantics and tests.
