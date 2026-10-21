# Control Flow

## Conditions

```brain
if hp <= 0 {
    print("defeated")
} elseif hp < 25 {
    print("critical")
} else {
    print("healthy")
}
```

## While loops

```brain
var i = 0
while i < 10 {
    i = i + 1
}
```

## Numeric for loops

```brain
for i = 1, 10, 1 {
    print(i)
}
```

The step is optional and defaults to `1`; zero is rejected.

## Generic iteration

```brain
let values = {"a", "b"}
for index, value in values {
    print(index, value)
}
```

The current implementation iterates table entries directly. A dedicated iterator protocol is planned.

## Loop control

`break` exits the current loop. `continue` skips to the next iteration.

## Exceptions

```brain
try {
    throw "failure"
} catch err {
    print(err)
}
```
