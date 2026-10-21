# Functions and Closures

## Named functions

```brain
fn add(a, b) {
    return a + b
}

print(add(2, 3))
```

## Default parameters

```brain
fn greet(name = "world") {
    print("Hello " .. name)
}
```

## Anonymous functions

```brain
let multiplier = fn(x) {
    return x * 2
}
```

## Closures

Functions capture their defining environment.

```brain
fn counter() {
    var value = 0
    return fn() {
        value = value + 1
        return value
    }
}
```

Closure semantics should remain stable when the future bytecode VM replaces the tree-walking interpreter.

## Error handling

Runtime exceptions propagate through function calls until a `try/catch` boundary handles them.
