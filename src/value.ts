import type { Expr, Param, Stmt } from "./ast.js";
import { Environment } from "./environment.js";

export type BrainPrimitive = null | boolean | number | string;
export type BrainValue = BrainPrimitive | BrainTable | BrainFunction | BrainNativeFunction | BrainClass | BrainInstance | BrainBoundMethod;

export class BrainTable {
  readonly entries = new Map<BrainPrimitive, BrainValue>();
  get(key: BrainPrimitive): BrainValue { return this.entries.get(key) ?? null; }
  set(key: BrainPrimitive, value: BrainValue): void {
    if (value === null) this.entries.delete(key);
    else this.entries.set(key, value);
  }
}

export interface ParamSpec extends Param {}
export class BrainFunction {
  constructor(
    public readonly name: string,
    public readonly params: ParamSpec[],
    public readonly body: Stmt[],
    public readonly closure: Environment,
    public readonly initializer = false
  ) {}
}

export type NativeCallback = (args: BrainValue[], interpreter: unknown) => BrainValue;
export class BrainNativeFunction {
  constructor(public readonly name: string, public readonly callback: NativeCallback, public readonly arity: number | null = null) {}
}

export class BrainClass {
  readonly methods = new Map<string, BrainFunction>();
  readonly fieldDefaults = new Map<string, Expr | null>();
  constructor(public readonly name: string, public readonly superclass: BrainClass | null) {}

  findMethod(name: string): BrainFunction | null {
    return this.methods.get(name) ?? this.superclass?.findMethod(name) ?? null;
  }
}

export class BrainInstance {
  readonly fields = new Map<string, BrainValue>();
  constructor(public readonly klass: BrainClass) {}

  get(name: string): BrainValue {
    if (this.fields.has(name)) return this.fields.get(name)!;
    const method = this.klass.findMethod(name);
    return method ? new BrainBoundMethod(method, this) : null;
  }

  set(name: string, value: BrainValue): void { this.fields.set(name, value); }
}

export class BrainBoundMethod {
  constructor(public readonly fn: BrainFunction, public readonly receiver: BrainInstance) {}
}

export function stringify(value: unknown): string {
  if (value === null || value === undefined) return "nil";
  if (typeof value === "boolean" || typeof value === "number" || typeof value === "string") return String(value);
  if (value instanceof BrainTable) return "table";
  if (value instanceof BrainClass) return `class ${value.name}`;
  if (value instanceof BrainInstance) return `${value.klass.name} instance`;
  if (value instanceof BrainBoundMethod) return `method ${value.fn.name}`;
  if (value instanceof BrainFunction) return `function ${value.name}`;
  if (value instanceof BrainNativeFunction) return `native function ${value.name}`;
  return "<value>";
}
