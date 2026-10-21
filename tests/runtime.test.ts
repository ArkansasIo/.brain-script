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

test("supports positional array table entries and the length operator", () => {
  assert.deepEqual(run('let items = {"a", "b", "c"} print(#items) print(items[2])'), ["3", "b"]);
});

test("supports implicit and keyed table entries mixed together", () => {
  assert.deepEqual(run('let config = {"first", name = "Astra", "second"} print(config[1] .. ":" .. config.name .. ":" .. config[2])'), ["first:Astra:second"]);
});

test("initializes inherited class fields before constructors", () => {
  assert.deepEqual(run('class Base { let baseValue = 10 } class Child extends Base { let childValue = self.baseValue + 5 init() { self.baseValue = self.baseValue + 1 } } let item = Child() print(item.baseValue .. ":" .. item.childValue)'), ["11:15"]);
});

test("rejects invalid table.insert positions", () => {
  assert.deepEqual(run('let items = {1, 2} try { table.insert(items, 4, 3) } catch err { print("range") }'), ["range"]);
});
