import { BrainSyntaxError, type Token, type TokenKind } from "./token.js";

const KEYWORDS = new Set([
  "and", "break", "catch", "class", "const", "continue", "do", "else", "elseif",
  "end", "extends", "false", "fn", "for", "function", "if", "in", "init", "let",
  "local", "method", "module", "nil", "not", "or", "return", "self", "super",
  "then", "throw", "true", "try", "var", "while"
]);
const TWO_CHAR = new Set(["==", "~=", "!=", "<=", ">=", "..", "//", "->"]);
const ONE_CHAR = "+-*/%^#=<>;:,.(){}[]";

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0, line = 1, column = 1;
  const advance = (): string => {
    const ch = source[i++] ?? "";
    if (ch === "\n") { line++; column = 1; } else column++;
    return ch;
  };
  const peek = (offset = 0): string => source[i + offset] ?? "";
  const add = (kind: TokenKind, start: number, startLine: number, startColumn: number, literal?: Token["literal"]) => {
    const token: Token = { kind, lexeme: source.slice(start, i), line: startLine, column: startColumn };
    if (literal !== undefined) token.literal = literal;
    tokens.push(token);
  };

  while (i < source.length) {
    const ch = peek();
    if (/\s/.test(ch)) { advance(); continue; }
    const start = i, startLine = line, startColumn = column;

    if (ch === "-" && peek(1) === "-") {
      advance(); advance();
      if (peek() === "[" && peek(1) === "[") {
        advance(); advance();
        while (i < source.length && !(peek() === "]" && peek(1) === "]")) advance();
        if (i >= source.length) throw new BrainSyntaxError("Unterminated block comment.", startLine, startColumn);
        advance(); advance();
      } else while (i < source.length && peek() !== "\n") advance();
      continue;
    }

    if (ch === "\"" || ch === "'") {
      const quote = advance();
      let value = "";
      let closed = false;
      while (i < source.length) {
        const next = advance();
        if (next === quote) { closed = true; break; }
        if (next === "\n") throw new BrainSyntaxError("String literal cannot contain a raw newline.", startLine, startColumn);
        if (next === "\\") {
          if (i >= source.length) break;
          const escaped = advance();
          const map: Record<string, string> = { n: "\n", r: "\r", t: "\t", "\\": "\\", '"': '"', "'": "'" };
          value += map[escaped] ?? escaped;
        } else value += next;
      }
      if (!closed) throw new BrainSyntaxError("Unterminated string literal.", startLine, startColumn);
      add("string", start, startLine, startColumn, value);
      continue;
    }

    if (/[0-9]/.test(ch)) {
      advance();
      while (/[0-9]/.test(peek())) advance();
      if (peek() === "." && peek(1) !== "." && /[0-9]/.test(peek(1))) {
        advance();
        while (/[0-9]/.test(peek())) advance();
      }
      const value = Number(source.slice(start, i));
      if (!Number.isFinite(value)) throw new BrainSyntaxError("Invalid number literal.", startLine, startColumn);
      add("number", start, startLine, startColumn, value);
      continue;
    }

    if (/[A-Za-z_]/.test(ch)) {
      advance();
      while (/[A-Za-z0-9_]/.test(peek())) advance();
      const word = source.slice(start, i);
      if (word === "true") add("keyword", start, startLine, startColumn, true);
      else if (word === "false") add("keyword", start, startLine, startColumn, false);
      else if (word === "nil") add("keyword", start, startLine, startColumn, null);
      else add(KEYWORDS.has(word) ? "keyword" : "identifier", start, startLine, startColumn);
      continue;
    }

    const pair = ch + peek(1);
    if (TWO_CHAR.has(pair)) {
      advance(); advance();
      add("operator", start, startLine, startColumn);
      continue;
    }
    if (ONE_CHAR.includes(ch)) {
      advance();
      add("punctuation", start, startLine, startColumn);
      continue;
    }
    throw new BrainSyntaxError(`Unexpected character ${JSON.stringify(ch)}.`, line, column);
  }

  tokens.push({ kind: "eof", lexeme: "", line, column });
  return tokens;
}
