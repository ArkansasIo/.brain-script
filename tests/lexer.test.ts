import test from "node:test";
import assert from "node:assert/strict";
import { tokenize } from "../src/lexer.js";

test("tokenizes keywords, identifiers, and operators", () => {
  const tokens = tokenize("let player = 5 >= 3 and not false -- comment");
  assert.deepEqual(tokens.slice(0, 7).map((t) => t.lexeme), ["let", "player", "=", "5", ">=", "3", "and"]);
  assert.equal(tokens.at(-1)?.kind, "eof");
});

test("decodes escaped strings", () => {
  const tokens = tokenize('"a\\nb"');
  assert.equal(tokens[0]?.literal, "a\nb");
});

test("recognizes Lua concatenation operator", () => {
  const tokens = tokenize('"hello" .. " world"');
  assert.equal(tokens[1]?.lexeme, "..");
});
