import test from "node:test";
import assert from "node:assert/strict";
import { tokenize } from "../src/lexer.js";
import { Parser } from "../src/parser.js";
import { Interpreter } from "../src/interpreter.js";

function run(source: string): string[] {
  const output: string[] = [];
  const program = new Parser(tokenize(source)).parse();
  new Interpreter({ output: text => output.push(text) }).interpret(program);
  return output;
}

test("executes arithmetic, function calls, and concatenation", () => {
  assert.deepEqual(run('fn double(n) { return n * 2 } print("value=" .. double(6))'), ["value=12"]);
});

test("executes branches and numeric loops", () => {
  assert.deepEqual(run('var total = 0 for i = 1, 4 { total = total + i } if total == 10 { print("ok") } else { print("bad") }'), ["ok"]);
});

test("executes tables and property assignments", () => {
  assert.deepEqual(run('let data = { name = "Astra", hp = 100 } data.hp = data.hp - 25 print(data.name .. ":" .. data.hp)'), ["Astra:75"]);
});

test("executes class constructor and methods", () => {
  assert.deepEqual(run('class Actor { init(name) { self.name = name } method label() { return "Actor:" .. self.name } } let actor = Actor("Nova") print(actor.label())'), ["Actor:Nova"]);
});

test("executes inheritance with super constructor", () => {
  assert.deepEqual(run('class Base { init(v) { self.v = v } method value() { return self.v } } class Child extends Base { init(v) { super.init(v + 1) } } let child = Child(4) print(child.value())'), ["5"]);
});

test("catches script errors", () => {
  assert.deepEqual(run('try { throw "bad" } catch err { print("caught:" .. err) }'), ["caught:bad"]);
});
