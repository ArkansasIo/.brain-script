# Agent Library Design

> **Status:** Planned. This document defines the target API; it is not currently exposed by the interpreter.

The agent library is intended to make BrainScript useful for AI-driven applications without giving scripts unrestricted host access.

## Proposed API

```brain
let agent = agent.create({name = "planner"})
agent.memory.set(agent, "goal", "build a ship")
let goal = agent.memory.get(agent, "goal")
agent.emit(agent, "task.created", {id = 1})
```

## Capability model

Agent operations should require explicit capabilities such as:

- `memory.read`
- `memory.write`
- `tool.call`
- `event.publish`
- `network.read`
- `filesystem.read`

Capabilities are host grants, not script-defined permissions. A script must never be able to escalate its own capability set.

## Resource limits

The future runtime should support instruction budgets, call-depth limits, memory limits, wall-clock deadlines, and tool-call quotas.
