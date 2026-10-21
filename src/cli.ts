import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tokenize } from "./lexer.js";
import { Parser } from "./parser.js";
import { Interpreter } from "./interpreter.js";

async function main(): Promise<void> {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: brain-script <file.brain>");
    process.exitCode = 2;
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
