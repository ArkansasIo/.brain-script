import type { ClassMember, Expr, Param, Program, Stmt } from "./ast.js";
import { Environment, BrainRuntimeError } from "./environment.js";
import {
  BrainBoundMethod, BrainClass, BrainFunction, BrainInstance, BrainNativeFunction,
  BrainTable, type BrainValue, stringify
} from "./value.js";

class ReturnSignal { constructor(public readonly value: BrainValue) {} }
class BreakSignal {}
class ContinueSignal {}

const isPrimitiveKey = (value: BrainValue): value is string | number | boolean | null =>
  value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean";

export interface InterpreterOptions {
  output?: (text: string) => void;
  maxSteps?: number;
  maxCallDepth?: number;
}

export class Interpreter {
  readonly globals = new Environment();
  private environment = this.globals;
  private steps = 0;
  private callDepth = 0;
  private readonly output: (text: string) => void;
  private readonly maxSteps: number;
  private readonly maxCallDepth: number;
  private currentClass: BrainClass | null = null;

  constructor(options: InterpreterOptions = {}) {
    this.output = options.output ?? ((text) => console.log(text));
    this.maxSteps = options.maxSteps ?? 100_000;
    this.maxCallDepth = options.maxCallDepth ?? 256;
    this.installBuiltins();
  }

  interpret(program: Program): void {
    for (const statement of program.body) this.execute(statement);
  }

  private tick(): void {
    this.steps++;
    if (this.steps > this.maxSteps) throw new BrainRuntimeError("Execution step budget exceeded.");
  }

  private installBuiltins(): void {
    const native = (name: string, arity: number | null, callback: (args: BrainValue[]) => BrainValue) => {
      this.globals.define(name, new BrainNativeFunction(name, (args) => callback(args), arity), true);
    };
    native("print", null, args => {
      this.output(args.map(stringify).join("\t"));
      return null;
    });
    native("type", 1, args => {
      const v = args[0];
      if (v === null) return "nil";
      if (v instanceof BrainTable) return "table";
      if (v instanceof BrainFunction || v instanceof BrainNativeFunction || v instanceof BrainBoundMethod) return "function";
      if (v instanceof BrainClass) return "class";
      if (v instanceof BrainInstance) return "instance";
      return typeof v;
    });
    native("pairs", 1, args => {
      if (!(args[0] instanceof BrainTable)) throw new BrainRuntimeError("pairs() expects a table.");
      const iterator = new BrainTable();
      let index = 1;
      for (const [key, value] of args[0].entries) {
        const pair = new BrainTable();
        pair.set(1, key); pair.set(2, value);
        iterator.set(index++, pair);
      }
      return iterator;
    });
    const math = new BrainTable();
    math.set("max", new BrainNativeFunction("math.max", args => Math.max(...args.map(v => this.requireNumber(v, "math.max"))), null));
    math.set("min", new BrainNativeFunction("math.min", args => Math.min(...args.map(v => this.requireNumber(v, "math.min"))), null));
    math.set("floor", new BrainNativeFunction("math.floor", args => Math.floor(this.requireNumber(args[0], "math.floor")), 1));
    math.set("ceil", new BrainNativeFunction("math.ceil", args => Math.ceil(this.requireNumber(args[0], "math.ceil")), 1));
    math.set("abs", new BrainNativeFunction("math.abs", args => Math.abs(this.requireNumber(args[0], "math.abs")), 1));
    this.globals.define("math", math, true);

    const tableLib = new BrainTable();
    tableLib.set("insert", new BrainNativeFunction("table.insert", args => {
      const target = args[0];
      if (!(target instanceof BrainTable)) throw new BrainRuntimeError("table.insert expects a table.");
      const value = args.length === 3 ? args[2]! : args[1]!;
      const index = args.length === 3 ? this.requireNumber(args[1], "table.insert") : this.sequenceLength(target) + 1;
      const len = this.sequenceLength(target);
      for (let i = len; i >= index; i--) target.set(i + 1, target.get(i));
      target.set(index, value);
      return null;
    }, null));
    tableLib.set("remove", new BrainNativeFunction("table.remove", args => {
      const target = args[0];
      if (!(target instanceof BrainTable)) throw new BrainRuntimeError("table.remove expects a table.");
      const index = args.length > 1 ? this.requireNumber(args[1], "table.remove") : this.sequenceLength(target);
      const value = target.get(index);
      for (let i = index; i < this.sequenceLength(target); i++) target.set(i, target.get(i + 1));
      target.set(this.sequenceLength(target), null);
      return value;
    }, null));
    this.globals.define("table", tableLib, true);

    const stringLib = new BrainTable();
    stringLib.set("lower", new BrainNativeFunction("string.lower", args => this.requireString(args[0], "string.lower").toLowerCase(), 1));
    stringLib.set("upper", new BrainNativeFunction("string.upper", args => this.requireString(args[0], "string.upper").toUpperCase(), 1));
    stringLib.set("len", new BrainNativeFunction("string.len", args => this.requireString(args[0], "string.len").length, 1));
    this.globals.define("string", stringLib, true);
  }

  private requireNumber(value: unknown, operation: string): number {
    if (typeof value !== "number" || !Number.isFinite(value)) throw new BrainRuntimeError(`${operation} expects a number.`);
    return value;
  }
  private requireString(value: unknown, operation: string): string {
    if (typeof value !== "string") throw new BrainRuntimeError(`${operation} expects a string.`);
    return value;
  }
  private sequenceLength(table: BrainTable): number {
    let length = 0;
    while (table.get(length + 1) !== null) length++;
    return length;
  }

  private execute(stmt: Stmt): void {
    this.tick();
    switch (stmt.type) {
      case "Block": this.executeBlock(stmt.statements, new Environment(this.environment)); break;
      case "VarDecl": {
        const value = stmt.initializer ? this.evaluate(stmt.initializer) : null;
        this.environment.define(stmt.name, value, stmt.mode === "const" || stmt.mode === "let");
        break;
      }
      case "FunctionDecl":
        this.environment.define(stmt.name, new BrainFunction(stmt.name, stmt.params, stmt.body, this.environment), true);
        break;
      case "ClassDecl": this.executeClass(stmt.name, stmt.superclass, stmt.members); break;
      case "Expression": this.evaluate(stmt.expression); break;
      case "If": {
        let handled = false;
        for (const branch of stmt.branches) {
          if (this.isTruthy(this.evaluate(branch.condition))) {
            this.executeBlock(branch.body, new Environment(this.environment)); handled = true; break;
          }
        }
        if (!handled && stmt.elseBody) this.executeBlock(stmt.elseBody, new Environment(this.environment));
        break;
      }
      case "While":
        while (this.isTruthy(this.evaluate(stmt.condition))) {
          try { this.executeBlock(stmt.body, new Environment(this.environment)); }
          catch (error) {
            if (error instanceof BreakSignal) break;
            if (!(error instanceof ContinueSignal)) throw error;
          }
          this.tick();
        }
        break;
      case "ForNumeric": {
        const start = this.requireNumber(this.evaluate(stmt.start), "numeric for start");
        const end = this.requireNumber(this.evaluate(stmt.end), "numeric for end");
        const step = stmt.step ? this.requireNumber(this.evaluate(stmt.step), "numeric for step") : 1;
        if (step === 0) throw new BrainRuntimeError("Numeric for-loop step cannot be zero.");
        for (let n = start; step > 0 ? n <= end : n >= end; n += step) {
          const env = new Environment(this.environment);
          env.define(stmt.name, n);
          try { this.executeBlock(stmt.body, env); }
          catch (error) {
            if (error instanceof BreakSignal) break;
            if (!(error instanceof ContinueSignal)) throw error;
          }
          this.tick();
        }
        break;
      }
      case "ForIn": {
        const value = this.evaluate(stmt.iterable);
        if (!(value instanceof BrainTable)) throw new BrainRuntimeError("Generic for-loop currently expects a table.");
        const entries = [...value.entries.entries()];
        for (const [key, item] of entries) {
          const env = new Environment(this.environment);
          env.define(stmt.names[0]!, key);
          if (stmt.names[1]) env.define(stmt.names[1], item);
          try { this.executeBlock(stmt.body, env); }
          catch (error) {
            if (error instanceof BreakSignal) break;
            if (!(error instanceof ContinueSignal)) throw error;
          }
          this.tick();
        }
        break;
      }
      case "Return": throw new ReturnSignal(stmt.value ? this.evaluate(stmt.value) : null);
      case "Break": throw new BreakSignal();
      case "Continue": throw new ContinueSignal();
      case "Throw": throw new BrainRuntimeError(stringify(this.evaluate(stmt.value)));
      case "Try":
        try { this.executeBlock(stmt.body, new Environment(this.environment)); }
        catch (error) {
          if (error instanceof ReturnSignal || error instanceof BreakSignal || error instanceof ContinueSignal) throw error;
          const env = new Environment(this.environment);
          env.define(stmt.errorName, error instanceof Error ? error.message : stringify(error), true);
          this.executeBlock(stmt.catchBody, env);
        }
        break;
      case "Module": break;
    }
  }

  private executeBlock(statements: Stmt[], environment: Environment): void {
    const previous = this.environment;
    try {
      this.environment = environment;
      for (const statement of statements) this.execute(statement);
    } finally {
      this.environment = previous;
    }
  }

  private executeClass(name: string, superclassExpr: Expr | null, members: ClassMember[]): void {
    let superclass: BrainClass | null = null;
    if (superclassExpr) {
      const value = this.evaluate(superclassExpr);
      if (!(value instanceof BrainClass)) throw new BrainRuntimeError("Superclass must be a class.");
      superclass = value;
    }
    this.environment.define(name, null);
    const klass = new BrainClass(name, superclass);
    const previousClass = this.currentClass;
    this.currentClass = klass;
    try {
      for (const member of members) {
        if (member.kind === "field") klass.fieldDefaults.set(member.name, member.initializer);
        else klass.methods.set(member.name, new BrainFunction(member.name, member.params, member.body, this.environment, member.kind === "init"));
      }
    } finally {
      this.currentClass = previousClass;
    }
    this.environment.assign(name, klass);
  }

  private evaluate(expr: Expr): BrainValue {
    this.tick();
    switch (expr.type) {
      case "Literal": return expr.value;
      case "Variable": return this.environment.get(expr.name) as BrainValue;
      case "This": return this.environment.get("self") as BrainValue;
      case "Super": {
        const self = this.environment.get("self");
        const superValue = this.environment.get("super");
        if (!(self instanceof BrainInstance) || !(superValue instanceof BrainClass)) throw new BrainRuntimeError("super can only be used within an instance method.");
        const method = superValue.findMethod(expr.method);
        if (!method) throw new BrainRuntimeError(`Superclass method "${expr.method}" was not found.`);
        return new BrainBoundMethod(method, self) as unknown as BrainValue;
      }
      case "Unary": {
        const value = this.evaluate(expr.right);
        if (expr.operator === "not") return !this.isTruthy(value);
        if (expr.operator === "-") return -this.requireNumber(value, "unary -");
        if (expr.operator === "#") {
          if (typeof value === "string") return value.length;
          if (value instanceof BrainTable) return this.sequenceLength(value);
          throw new BrainRuntimeError("Length operator expects a string or table.");
        }
        throw new BrainRuntimeError(`Unknown unary operator "${expr.operator}".`);
      }
      case "Binary": {
        const left = this.evaluate(expr.left);
        if (expr.operator === "and") return this.isTruthy(left) ? this.evaluate(expr.right) : left;
        if (expr.operator === "or") return this.isTruthy(left) ? left : this.evaluate(expr.right);
        const right = this.evaluate(expr.right);
        switch (expr.operator) {
          case "+": return this.requireNumber(left, "+") + this.requireNumber(right, "+");
          case "-": return this.requireNumber(left, "-") - this.requireNumber(right, "-");
          case "*": return this.requireNumber(left, "*") * this.requireNumber(right, "*");
          case "/": { const divisor = this.requireNumber(right, "/"); if (divisor === 0) throw new BrainRuntimeError("Division by zero."); return this.requireNumber(left, "/") / divisor; }
          case "//": { const divisor = this.requireNumber(right, "//"); if (divisor === 0) throw new BrainRuntimeError("Division by zero."); return Math.floor(this.requireNumber(left, "//") / divisor); }
          case "%": return this.requireNumber(left, "%") % this.requireNumber(right, "%");
          case "^": return this.requireNumber(left, "^") ** this.requireNumber(right, "^");
          case "..": return stringify(left) + stringify(right);
          case "==": return this.equal(left, right);
          case "~=": case "!=": return !this.equal(left, right);
          case "<": return this.compare(left, right) < 0;
          case "<=": return this.compare(left, right) <= 0;
          case ">": return this.compare(left, right) > 0;
          case ">=": return this.compare(left, right) >= 0;
          default: throw new BrainRuntimeError(`Unknown binary operator "${expr.operator}".`);
        }
      }
      case "Assign": {
        const value = this.evaluate(expr.value);
        if (expr.target.type === "Variable") this.environment.assign(expr.target.name, value);
        else if (expr.target.type === "Get") {
          const object = this.evaluate(expr.target.object);
          if (object instanceof BrainInstance) object.set(expr.target.name, value);
          else if (object instanceof BrainTable) object.set(expr.target.name, value);
          else throw new BrainRuntimeError("Property assignment expects an object or table.");
        } else if (expr.target.type === "Index") {
          const object = this.evaluate(expr.target.object), key = this.evaluate(expr.target.index);
          if (!(object instanceof BrainTable) || !isPrimitiveKey(key)) throw new BrainRuntimeError("Index assignment expects a table and primitive key.");
          object.set(key, value);
        }
        return value;
      }
      case "Call": {
        const callee = this.evaluate(expr.callee);
        const args = expr.args.map(arg => this.evaluate(arg));
        return this.call(callee, args);
      }
      case "Get": {
        const object = this.evaluate(expr.object);
        if (object instanceof BrainInstance) return object.get(expr.name);
        if (object instanceof BrainTable) return object.get(expr.name);
        throw new BrainRuntimeError("Property access expects an object or table.");
      }
      case "Index": {
        const object = this.evaluate(expr.object), key = this.evaluate(expr.index);
        if (!(object instanceof BrainTable) || !isPrimitiveKey(key)) throw new BrainRuntimeError("Index access expects a table and primitive key.");
        return object.get(key);
      }
      case "Function": return new BrainFunction("<anonymous>", expr.params, expr.body, this.environment);
      case "Table": {
        const table = new BrainTable();
        let implicitIndex = 1;
        for (const entry of expr.entries) {
          const key = this.evaluate(entry.key);
          const value = this.evaluate(entry.value);
          if (!isPrimitiveKey(key)) throw new BrainRuntimeError("Table keys must be primitive values.");
          table.set(key, value);
          if (typeof key === "number" && key >= implicitIndex) implicitIndex = key + 1;
        }
        void implicitIndex;
        return table;
      }
    }
  }

  private call(callee: BrainValue | BrainBoundMethod, args: BrainValue[]): BrainValue {
    if (callee instanceof BrainNativeFunction) {
      if (callee.arity !== null && args.length !== callee.arity) throw new BrainRuntimeError(`${callee.name} expects ${callee.arity} argument(s).`);
      return callee.callback(args, this);
    }
    if (callee instanceof BrainBoundMethod) return this.callFunction(callee.fn, args, callee.receiver);
    if (callee instanceof BrainFunction) return this.callFunction(callee, args, null);
    if (callee instanceof BrainClass) {
      const instance = new BrainInstance(callee);
      const initializer = callee.findMethod("init");
      if (initializer) this.callFunction(initializer, args, instance);
      for (const [field, expression] of callee.fieldDefaults) {
        if (expression) instance.set(field, this.evaluate(expression));
      }
      return instance;
    }
    throw new BrainRuntimeError("Value is not callable.");
  }

  private callFunction(fn: BrainFunction, args: BrainValue[], receiver: BrainInstance | null): BrainValue {
    this.callDepth++;
    if (this.callDepth > this.maxCallDepth) {
      this.callDepth--;
      throw new BrainRuntimeError("Maximum call depth exceeded.");
    }
    const environment = new Environment(fn.closure);
    if (receiver) environment.define("self", receiver, true);
    if (receiver && this.currentClass?.superclass) environment.define("super", this.currentClass.superclass, true);
    fn.params.forEach((param: Param, index) => {
      let value = args[index];
      if (value === undefined && param.defaultValue) {
        const previous = this.environment;
        this.environment = environment;
        try { value = this.evaluate(param.defaultValue); } finally { this.environment = previous; }
      }
      environment.define(param.name, value ?? null);
    });
    try {
      this.executeBlock(fn.body, environment);
    } catch (error) {
      if (error instanceof ReturnSignal) return error.value;
      throw error;
    } finally {
      this.callDepth--;
    }
    return receiver && fn.initializer ? receiver : null;
  }

  private equal(a: BrainValue, b: BrainValue): boolean { return a === b; }
  private compare(a: BrainValue, b: BrainValue): number {
    if (typeof a === "number" && typeof b === "number") return a - b;
    if (typeof a === "string" && typeof b === "string") return a < b ? -1 : a > b ? 1 : 0;
    throw new BrainRuntimeError("Comparison requires two numbers or two strings.");
  }
  private isTruthy(value: BrainValue): boolean { return value !== null && value !== false; }
}
