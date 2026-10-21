# Game Scripting Guide

BrainScript is suitable for gameplay rules because tables, functions, classes, and deterministic execution can model entities and systems without requiring engine-specific syntax.

## Entity example

```brain
class Enemy {
    init(name, hp, damage) {
        self.name = name
        self.hp = hp
        self.damageValue = damage
    }

    method attack(target) {
        target.hp = target.hp - self.damageValue
    }

    method alive() {
        return self.hp > 0
    }
}
```

## Data-driven configuration

```brain
let sword = {
    id = "iron_sword",
    damage = 25,
    rarity = "common"
}
```

## Recommended engine integration

Expose engine systems through narrow host functions or capability objects rather than global native handles. A game host can provide APIs for entities, world queries, events, UI, audio, persistence, and networking.

## Tick model

For deterministic gameplay, scripts should execute inside an explicit game tick. Long-running work should be divided into bounded operations or future coroutines/tasks.

## Networking

Authoritative server logic should not trust client-provided script results. Shared game rules can run on both sides, but authoritative state transitions belong to the server.
