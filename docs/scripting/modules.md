# Modules and Packages

> **Status:** Planned.

The parser recognizes module declarations, but the current runtime does not load or execute modules. Executing a module declaration currently raises an explicit runtime error.

## Target syntax

```brain
module "game.player"

fn createPlayer(name) {
    return {name = name}
}
```

Future import syntax is expected to resemble:

```brain
import "game.player" as player
```

## Resolver design

The module system should resolve modules from explicit search roots, normalize paths, reject traversal outside permitted roots, cache loaded modules, and expose a deterministic module identity.

## Package system

A future package manager should support manifests, semantic versions, dependency graphs, lockfiles, integrity hashes, and optional package signatures.
