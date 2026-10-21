# Table Library

Tables are BrainScript's primary aggregate data structure. They support primitive keys, positional entries, member access, and indexed access.

## API

### `table.insert(table, value)`

Appends a value to the contiguous numeric sequence.

### `table.insert(table, index, value)`

Inserts a value at `index` and shifts later sequence elements.

### `table.remove(table)`

Removes and returns the final sequence element.

### `table.remove(table, index)`

Removes and returns the sequence element at `index`.

### `table.length(table)`

Returns the contiguous sequence length.

## Constructors

```brain
let inventory = {"sword", "shield", "potion"}
let player = {
    name = "Nova",
    level = 10
}
```

Mixed positional and keyed entries are supported.

## Iteration

The current generic `for` loop iterates table entries. The `pairs` helper currently materializes key/value pairs; it is not yet a Lua-compatible iterator protocol.
