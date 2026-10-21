import type { Expr, Param, Program, Stmt, ClassMember } from "./ast.js";
import { BrainSyntaxError, type Token } from "./token.js";

const PRECEDENCE: Record<string, number> = {
  or: 1, and: 2, "==": 3, "~=": 3, "!=": 3, "<": 4, "<=": 4, ">": 4, ">=": 4,
  "..": 5, "+": 6, "-": 6, "*": 7, "/": 7, "//": 7, "%": 7, "^": 8
};

export class Parser {
  private current = 0;
  constructor(private readonly tokens: Token[]) {}

  parse(): Program {
    const body: Stmt[] = [];
    while (!this.isAtEnd()) body.push(this.declaration());
    return { body };
  }

  private declaration(): Stmt {
    if (this.match("module")) return { type: "Module", name: String(this.consumeKind("string", "Expected module name.").literal ?? "") };
    if (this.match("class")) return this.classDeclaration();
    if (this.check("fn") || this.check("function")) {
      if (this.peekNext().kind === "identifier") {
        this.advance();
        return this.functionDeclaration();
      }
    }
    if (this.match("let", "var", "const", "local")) {
      const mode = this.previous().lexeme === "local" ? "let" : this.previous().lexeme as "let" | "var" | "const";
      const name = this.consumeKind("identifier", "Expected variable name.").lexeme;
      const initializer = this.match("=") ? this.expression() : null;
      this.match(";");
      return { type: "VarDecl", name, mode, initializer };
    }
    return this.statement();
  }

  private classDeclaration(): Stmt {
    const name = this.consumeKind("identifier", "Expected class name.").lexeme;
    const superclass = this.match("extends") ? this.expression() : null;
    this.consume("{", "Expected '{' before class body.");
    const members: ClassMember[] = [];
    while (!this.check("}") && !this.isAtEnd()) {
      if (this.match("init")) {
        members.push({ kind: "init", name: "init", params: this.parameters(), body: this.blockBody(), initializer: null });
      } else if (this.match("method")) {
        const methodName = this.consumeKind("identifier", "Expected method name.").lexeme;
        members.push({ kind: "method", name: methodName, params: this.parameters(), body: this.blockBody(), initializer: null });
      } else if (this.match("let", "var", "const")) {
        const fieldName = this.consumeKind("identifier", "Expected field name.").lexeme;
        const initializer = this.match("=") ? this.expression() : null;
        this.match(";");
        members.push({ kind: "field", name: fieldName, params: [], body: [], initializer });
      } else throw this.error(this.peek(), "Expected init, method, or field declaration in class body.");
    }
    this.consume("}", "Expected '}' after class body.");
    return { type: "ClassDecl", name, superclass, members };
  }

  private functionDeclaration(): Stmt {
    const name = this.consumeKind("identifier", "Expected function name.").lexeme;
    return { type: "FunctionDecl", name, params: this.parameters(), body: this.blockBody() };
  }

  private statement(): Stmt {
    if (this.match("{")) return { type: "Block", statements: this.blockStatements() };
    if (this.match("if")) return this.ifStatement();
    if (this.match("while")) return { type: "While", condition: this.expression(), body: this.blockBody() };
    if (this.match("for")) return this.forStatement();
    if (this.match("return")) {
      const value = this.check("}") || this.check(";") || this.checkKind("eof") ? null : this.expression();
      this.match(";");
      return { type: "Return", value };
    }
    if (this.match("break")) { this.match(";"); return { type: "Break" }; }
    if (this.match("continue")) { this.match(";"); return { type: "Continue" }; }
    if (this.match("throw")) {
      const value = this.expression(); this.match(";");
      return { type: "Throw", value };
    }
    if (this.match("try")) {
      const body = this.blockBody();
      this.consume("catch", "Expected catch after try block.");
      const errorName = this.consumeKind("identifier", "Expected catch variable.").lexeme;
      return { type: "Try", body, errorName, catchBody: this.blockBody() };
    }
    const expression = this.expression();
    this.match(";");
    return { type: "Expression", expression };
  }

  private ifStatement(): Stmt {
    const branches: { condition: Expr; body: Stmt[] }[] = [];
    branches.push({ condition: this.expression(), body: this.blockBody() });
    while (this.match("elseif")) branches.push({ condition: this.expression(), body: this.blockBody() });
    const elseBody = this.match("else") ? this.blockBody() : null;
    return { type: "If", branches, elseBody };
  }

  private forStatement(): Stmt {
    const first = this.consumeKind("identifier", "Expected loop variable.").lexeme;
    if (this.match("=")) {
      const start = this.expression();
      this.consume(",", "Expected ',' after numeric loop start.");
      const end = this.expression();
      const step = this.match(",") ? this.expression() : null;
      return { type: "ForNumeric", name: first, start, end, step, body: this.blockBody() };
    }
    const names = [first];
    while (this.match(",")) names.push(this.consumeKind("identifier", "Expected loop variable.").lexeme);
    this.consume("in", "Expected 'in' in generic for loop.");
    return { type: "ForIn", names, iterable: this.expression(), body: this.blockBody() };
  }

  private expression(): Expr { return this.assignment(); }
  private assignment(): Expr {
    const expr = this.binary(1);
    if (this.match("=")) {
      const value = this.assignment();
      if (expr.type === "Variable" || expr.type === "Get" || expr.type === "Index") return { type: "Assign", target: expr, value };
      throw this.error(this.previous(), "Invalid assignment target.");
    }
    return expr;
  }
  private binary(minPrecedence: number): Expr {
    let expr = this.unary();
    while (true) {
      const op = this.peek().lexeme;
      const precedence = PRECEDENCE[op];
      if (precedence === undefined || precedence < minPrecedence) break;
      this.advance();
      const next = op === "^" || op === ".." ? precedence : precedence + 1;
      expr = { type: "Binary", left: expr, operator: op, right: this.binary(next) };
    }
    return expr;
  }
  private unary(): Expr {
    if (this.match("-", "not", "#")) return { type: "Unary", operator: this.previous().lexeme, right: this.unary() };
    let expr = this.primary();
    while (true) {
      if (this.match("(")) {
        const args: Expr[] = [];
        if (!this.check(")")) do { args.push(this.expression()); } while (this.match(","));
        this.consume(")", "Expected ')' after arguments.");
        expr = { type: "Call", callee: expr, args };
      } else if (this.match(".")) {
        const name = this.consumePropertyName("Expected property name.");
        expr = { type: "Get", object: expr, name };
      } else if (this.match("[")) {
        const index = this.expression();
        this.consume("]", "Expected ']' after index.");
        expr = { type: "Index", object: expr, index };
      } else if (this.match(":")) {
        const name = this.consumePropertyName("Expected method name.");
        const get: Expr = { type: "Get", object: expr, name };
        this.consume("(", "Expected '(' after method name.");
        const args: Expr[] = [];
        if (!this.check(")")) do { args.push(this.expression()); } while (this.match(","));
        this.consume(")", "Expected ')' after method arguments.");
        expr = { type: "Call", callee: get, args: [{ type: "This" }, ...args] };
      } else break;
    }
    return expr;
  }
  private consumePropertyName(message: string): string {
    const token = this.peek();
    if (token.kind !== "identifier" && token.kind !== "keyword") throw this.error(token, message);
    this.advance();
    return token.lexeme;
  }
  private primary(): Expr {
    if (this.match("true")) return { type: "Literal", value: true };
    if (this.match("false")) return { type: "Literal", value: false };
    if (this.match("nil")) return { type: "Literal", value: null };
    if (this.matchKind("number", "string")) return { type: "Literal", value: this.previous().literal as string | number };
    if (this.match("self")) return { type: "This" };
    if (this.match("super")) {
      this.consume(".", "Expected '.' after super.");
      return { type: "Super", method: this.consumePropertyName("Expected superclass method.") };
    }
    if (this.match("fn", "function")) return { type: "Function", params: this.parameters(), body: this.blockBody() };
    if (this.match("(")) {
      const expr = this.expression();
      this.consume(")", "Expected ')' after expression.");
      return expr;
    }
    if (this.match("{")) {
      const entries: { key: Expr; value: Expr }[] = [];
      while (!this.check("}") && !this.isAtEnd()) {
        let key: Expr;
        let value: Expr;
        if (this.checkKind("identifier") || this.checkKind("keyword")) {
          if (this.peekNext().lexeme === "=") {
            key = { type: "Literal", value: this.advance().lexeme };
            this.advance();
            value = this.expression();
          } else {
            key = { type: "Literal", value: this.nextImplicitIndex(entries) };
            value = this.expression();
          }
        } else {
          key = { type: "Literal", value: this.nextImplicitIndex(entries) };
          value = this.expression();
        }
        entries.push({ key, value });
        if (!this.match(",", ";")) break;
      }
      this.consume("}", "Expected '}' after table constructor.");
      return { type: "Table", entries };
    }
    if (this.matchKind("identifier")) return { type: "Variable", name: this.previous().lexeme };
    throw this.error(this.peek(), "Expected expression.");
  }

  private nextImplicitIndex(entries: { key: Expr; value: Expr }[]): number {
    let max = 0;
    for (const entry of entries) {
      if (entry.key.type === "Literal" && typeof entry.key.value === "number" && entry.key.value > max) max = entry.key.value;
    }
    return max + 1;
  }

  private parameters(): Param[] {
    this.consume("(", "Expected '(' before parameters.");
    const params: Param[] = [];
    if (!this.check(")")) do {
      const name = this.consumeKind("identifier", "Expected parameter name.").lexeme;
      const defaultValue = this.match("=") ? this.expression() : null;
      params.push({ name, defaultValue });
    } while (this.match(","));
    this.consume(")", "Expected ')' after parameters.");
    return params;
  }
  private blockBody(): Stmt[] {
    this.consume("{", "Expected '{' before block.");
    return this.blockStatements();
  }
  private blockStatements(): Stmt[] {
    const statements: Stmt[] = [];
    while (!this.check("}") && !this.isAtEnd()) statements.push(this.declaration());
    this.consume("}", "Expected '}' after block.");
    return statements;
  }
  private match(...lexemes: string[]): boolean {
    for (const lexeme of lexemes) if (this.check(lexeme)) { this.advance(); return true; }
    return false;
  }
  private matchKind(...kinds: Token["kind"][]): boolean {
    if (!kinds.includes(this.peek().kind)) return false;
    this.advance(); return true;
  }
  private check(lexeme: string): boolean { return this.peek().lexeme === lexeme; }
  private checkKind(kind: Token["kind"]): boolean { return this.peek().kind === kind; }
  private consume(lexeme: string, message: string): Token {
    if (this.check(lexeme)) return this.advance();
    throw this.error(this.peek(), message);
  }
  private consumeKind(kind: Token["kind"], message: string): Token {
    if (this.checkKind(kind)) return this.advance();
    throw this.error(this.peek(), message);
  }
  private advance(): Token { if (!this.isAtEnd()) this.current++; return this.previous(); }
  private isAtEnd(): boolean { return this.peek().kind === "eof"; }
  private peek(): Token { return this.tokens[this.current]!; }
  private peekNext(): Token { return this.tokens[Math.min(this.current + 1, this.tokens.length - 1)]!; }
  private previous(): Token { return this.tokens[this.current - 1]!; }
  private error(token: Token, message: string): BrainSyntaxError { return new BrainSyntaxError(message, token.line, token.column); }
}
