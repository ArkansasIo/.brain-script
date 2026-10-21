export interface Program { body: Stmt[]; }

export type Stmt =
  | { type: "Block"; statements: Stmt[] }
  | { type: "VarDecl"; name: string; mode: "let" | "var" | "const"; initializer: Expr | null }
  | { type: "FunctionDecl"; name: string; params: Param[]; body: Stmt[] }
  | { type: "ClassDecl"; name: string; superclass: Expr | null; members: ClassMember[] }
  | { type: "Expression"; expression: Expr }
  | { type: "If"; branches: { condition: Expr; body: Stmt[] }[]; elseBody: Stmt[] | null }
  | { type: "While"; condition: Expr; body: Stmt[] }
  | { type: "ForNumeric"; name: string; start: Expr; end: Expr; step: Expr | null; body: Stmt[] }
  | { type: "ForIn"; names: string[]; iterable: Expr; body: Stmt[] }
  | { type: "Return"; value: Expr | null }
  | { type: "Break" }
  | { type: "Continue" }
  | { type: "Throw"; value: Expr }
  | { type: "Try"; body: Stmt[]; errorName: string; catchBody: Stmt[] }
  | { type: "Module"; name: string };

export interface Param { name: string; defaultValue: Expr | null; }
export interface ClassMember {
  kind: "method" | "init" | "field";
  name: string;
  params: Param[];
  body: Stmt[];
  initializer: Expr | null;
}

export type Expr =
  | { type: "Literal"; value: string | number | boolean | null }
  | { type: "Variable"; name: string }
  | { type: "This" }
  | { type: "Super"; method: string }
  | { type: "Unary"; operator: string; right: Expr }
  | { type: "Binary"; left: Expr; operator: string; right: Expr }
  | { type: "Assign"; target: Expr; value: Expr }
  | { type: "Call"; callee: Expr; args: Expr[] }
  | { type: "Get"; object: Expr; name: string }
  | { type: "Index"; object: Expr; index: Expr }
  | { type: "Function"; params: Param[]; body: Stmt[] }
  | { type: "Table"; entries: { key: Expr; value: Expr }[] };
