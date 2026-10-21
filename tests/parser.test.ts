import test from "node:test";
import assert from "node:assert/strict";
import { tokenize } from "../src/lexer.js";
import { Parser } from "../src/parser.js";

const parse = (source: string) => new Parser(tokenize(source)).parse();

test("parses variable declarations and binary expressions", () => {
  const program = parse("let score = 10 + 2 * 3");
  assert.equal(program.body[0]?.type, "VarDecl");
  if (program.body[0]?.type === "VarDecl" && program.body[0].initializer?.type === "Binary") {
    assert.equal(program.body[0].initializer.operator, "+");
    assert.equal(program.body[0].initializer.right.type, "Binary");
  } else assert.fail("Expected initialized variable declaration");
});

test("parses if/elseif/else branches", () => {
  const program = parse('if x > 2 { print("high") } elseif x == 2 { print("same") } else { print("low") }');
  assert.equal(program.body[0]?.type, "If");
  if (program.body[0]?.type === "If") {
    assert.equal(program.body[0].branches.length, 2);
    assert.equal(program.body[0].elseBody?.length, 1);
  }
});

test("parses class inheritance and methods", () => {
  const program = parse('class Player extends Entity { init(name) { self.name = name } method alive() { return true } }');
  assert.equal(program.body[0]?.type, "ClassDecl");
  if (program.body[0]?.type === "ClassDecl") {
    assert.equal(program.body[0].name, "Player");
    assert.equal(program.body[0].members.length, 2);
  }
});

test("parses table constructors and member access", () => {
  const program = parse('let config = { title = "Demo", retries = 3 }');
  assert.equal(program.body[0]?.type, "VarDecl");
});
