# Core Library

## `print(...)`

Writes arguments separated by tabs through the interpreter output sink.

```brain
print("HP", 100)
```

## `type(value)`

Returns a BrainScript type label such as `nil`, `boolean`, `number`, `string`, `table`, `function`, `class`, or `instance`.

## Runtime contract

Core functions are installed in the global environment by the interpreter. Future versions should expose the same behavior through a standard-library module namespace while preserving compatibility.

## Error behavior

Arity and type errors are runtime errors and should include the function name and expected argument shape.
