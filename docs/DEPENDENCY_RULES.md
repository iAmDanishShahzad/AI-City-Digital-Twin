# AI City Digital Twin: Dependency Rules

## Purpose

These rules keep the MVP modular, testable, and free of circular dependencies. During every code review, check new imports against this document and `PROJECT_STRUCTURE.md`.

## Layer Direction

```text
Presentation
      |
      v
Application
      |
      v
Domain (district, scenarios, simulation, analytics, insights)
      |
      v
Core
```

Dependencies flow downward only. Application is the composition root: it may assemble presentation and domain modules, but lower layers must never import Application.

## Allowed Dependencies

| Layer or module | May depend on | Must not depend on |
| --- | --- | --- |
| Presentation | Its own projection, interface, and scene code; Core contracts | Application, Simulation, Analytics, Insights, Scenario effects, Infrastructure |
| Application | Presentation public entry points; public domain APIs; Core | Private internals of another module |
| District | Core | Application, Presentation, other Domain modules, Infrastructure |
| Scenarios | Core | Application, Presentation, Simulation engine, Analytics, Infrastructure |
| Simulation | District definitions/ public API; Core | Application, Presentation, Analytics, Insights, Infrastructure |
| Analytics | Simulation and Scenarios public APIs; Core | Application, Presentation, Insights, Infrastructure |
| Insights | Analytics and Scenario public APIs; Core | Application, Presentation, Simulation engine, Infrastructure |
| Core | Nothing in this project | Every project layer |
| Infrastructure (if added) | Core and explicit adapter contracts | Simulation logic/ rules, analytics rules, presentation behavior, application use cases |

## Rules

- Presentation must not import Simulation directly, including routing, engine, congestion, analytics, scenario-effect, or insight implementations.
- Presentation must never implement business or simulation logic; it renders projection data and emits user intent through callbacks.
- Application orchestrates use cases: it validates intent, applies scenarios, advances state, requests analytics and insight, and publishes projections. It must not contain routing, lifecycle, congestion, or analytics rules.
- Simulation contains all deterministic domain behavior: graph traversal, routing, vehicle lifecycle, congestion, closure behavior, scenario behavior, and reset state.
- Analytics derives immutable facts/ impact facts from snapshots; Insights derive deterministic text from validated facts. Neither may mutate simulation state.
- Core contains dependency-free shared contracts, result values/ types, and small utilities only. It is not a general-purpose dumping ground.
- Infrastructure is an optional adapter boundary for external concerns such as static deployment or a future external insight provider. It must not contain simulation logic or become the source of truth for own domain state.
- Cross-domain imports use a module's public entry point only; never import a sibling module's private files or folders.
- Dependencies flow downward only. Prefer `import type` for cross-layer contracts. Move a truly shared contract to Core rather than creating a reverse dependency.
- Circular dependencies are forbidden. Move orchestration to Application or extract a narrow Core contract instead.

## Code Review Import Check

Before approving a change, confirm:

- Does every import move according to the table?
- Does every import use a public API?
- Could a callback, value object, projection, or Core contract remove the dependency?
- Does the change keep presentation read-only and domain behavior deterministic?
- Does the dependency introduce a cycle, hidden shared state, or infrastructure-owned business logic?

If any answer is unclear, clarify the module boundary before adding the import..
