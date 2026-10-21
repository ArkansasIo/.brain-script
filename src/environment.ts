export class BrainRuntimeError extends Error {
  constructor(message: string, public readonly line?: number, public readonly column?: number) {
    super(message);
    this.name = "BrainRuntimeError";
  }
}

export class Environment {
  private readonly values = new Map<string, unknown>();
  private readonly constants = new Set<string>();
  constructor(public readonly parent: Environment | null = null) {}

  define(name: string, value: unknown, constant = false): void {
    if (this.values.has(name)) throw new BrainRuntimeError(`"${name}" is already declared in this scope.`);
    this.values.set(name, value);
    if (constant) this.constants.add(name);
  }

  get(name: string): unknown {
    if (this.values.has(name)) return this.values.get(name);
    if (this.parent) return this.parent.get(name);
    throw new BrainRuntimeError(`Undefined variable "${name}".`);
  }

  assign(name: string, value: unknown): void {
    if (this.values.has(name)) {
      if (this.constants.has(name)) throw new BrainRuntimeError(`Cannot reassign constant "${name}".`);
      this.values.set(name, value);
      return;
    }
    if (this.parent) { this.parent.assign(name, value); return; }
    throw new BrainRuntimeError(`Cannot assign to undefined variable "${name}".`);
  }

  containsLocal(name: string): boolean { return this.values.has(name); }
}
