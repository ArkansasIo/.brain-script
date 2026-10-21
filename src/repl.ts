import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { tokenize } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";

export async function startRepl(): Promise<void> {
  let interpreter = new Interpreter();
  const rl = createInterface({ input, output, prompt: "brain> " });

  console.log("BrainScript REPL");
  console.log("Commands: :help, :clear, :quit");
  rl.prompt();

  for await (const line of rl) {
    const source = line.trim();
    if (!source) { rl.prompt(); continue; }
    if (source === ":quit" || source === ":q") break;
    if (source === ":help") {
      console.log(":help   Show this help");
      console.log(":clear  Reset interpreter state");
      console.log(":quit   Exit the REPL");
      rl.prompt();
      continue;
    }
    if (source === ":clear") {
      interpreter = new Interpreter();
      console.log("Interpreter state reset.");
      rl.prompt();
      continue;
    }
    try {
      const program = new Parser(tokenize(source)).parse();
      interpreter.interpret(program);
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
    }
    rl.prompt();
  }
  rl.close();
}
