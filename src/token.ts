export type TokenKind =
  | "identifier" | "number" | "string" | "keyword" | "operator"
  | "punctuation" | "eof";

export interface Token {
  kind: TokenKind;
  lexeme: string;
  literal?: string | number | boolean | null;
  line: number;
  column: number;
}

export class BrainSyntaxError extends Error {
  constructor(message: string, public readonly line: number, public readonly column: number) {
    super(`[${line}:${column}] ${message}`);
    this.name = "BrainSyntaxError";
  }
}
