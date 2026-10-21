import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tokenize } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";
import { startRepl } from "./repl.js";

async function main(): Promise<void> {
  const path = process.argv[2];
  if (!path || path === "--repl" || path === "-i") {
    await startRepl();
    return;
  }
  if (path === "--help" || path === "-h") {
    console.log("Usage: brain-script <file.brain>");
    console.log("       brain-script --repl");
    return;
  }
  try {
    const source = await readFile(resolve(path), "utf8");
    const ast = new Parser(tokenize(source)).parse();
    new Interpreter().interpret(ast);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

await main();
