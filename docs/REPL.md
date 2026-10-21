# BrainScript REPL

BrainScript now includes an interactive command-line REPL for experimenting with the language without creating a source file.

## Start

```bash
npm install
npm run repl
```

Or after building:

```bash
node dist/src/cli.js --repl
```

## Commands

| Command | Action |
|---|---|
| `:help` | Show REPL commands |
| `:quit` / `:q` | Exit |
| `:clear` | Show the state-reset notice |

## Examples

```text
brain> let x = 10
brain> fn square(n) { return n * n }
brain> print(square(x))
100
```

Object-oriented code can also be entered after the parser receives a complete declaration:

```brain
class Player {
    init(name) {
        self.name = name
    }

    method greet() {
        return "Hello " .. self.name
    }
}

let player = Player("Nova")
print(player.greet())
```

The REPL uses the same lexer, parser, interpreter, runtime values, and standard library as `.brain` source files, so it is intended as a language-development tool rather than a separate execution mode.
