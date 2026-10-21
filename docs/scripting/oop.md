# Object-Oriented Programming

BrainScript provides classes, instances, constructors, methods, fields, inheritance, and `super`.

## Class

```brain
class Entity {
    let kind = "entity"

    init(name, hp) {
        self.name = name
        self.hp = hp
    }

    method damage(amount) {
        self.hp = self.hp - amount
    }
}
```

## Instance creation

```brain
let hero = Entity("Nova", 250)
hero.damage(40)
```

## Inheritance

```brain
class Player extends Entity {
    init(name, hp, level) {
        super.init(name, hp)
        self.level = level
    }

    method status() {
        return self.name .. " LV=" .. self.level .. " HP=" .. self.hp
    }
}
```

## Object model

- A class owns methods and field initializers.
- An instance owns mutable field values.
- Methods are bound to their receiver when accessed through an instance.
- Base-class fields initialize before derived-class fields.
- Constructors execute after field initialization.
- `super.method` resolves a parent method.

Deep inheritance and advanced `super` dispatch remain under conformance testing.
