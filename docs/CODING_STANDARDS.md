# AI City Digital Twin: Coding Standards

## 1. Purpose

These standards keep the MVP readable, modular, testable, and reliable without creating process overhead that slows a solo developer. They turn the product, architecture, technology-stack, and project-structure decisions into everyday implementation rules.

When a rule conflicts with a clear, simpler solution that still preserves the architecture, prefer the simpler solution and record the decision if it materially changes project direction.

## 2. General Principles

- Prefer clarity over cleverness and explicit behavior over implicit magic.
- Build one verified feature at a time; do not combine unrelated major changes.
- Keep responsibilities narrow. A module should have one reason to change.
- Preserve deterministic behavior for the core demo path.
- Favor small, composable functions and immutable inputs and outputs.
- Avoid unnecessary dependencies, abstractions, configuration, and premature generalization.
- Remove dead code rather than commenting it out.
- Treat the simulation as illustrative, not as a real-world prediction or operational recommendation.
- Keep the user-facing experience understandable without exposing internal domain complexity.

## 3. TypeScript Standards

- Use strict compiler settings; do not weaken them to silence an error.
- Type all public module contracts, function parameters, return values, state, and external data boundaries.
- Prefer `type` for composed data shapes and `interface` only when a deliberate extension contract is needed.
- Model finite values with unions or discriminated unions, such as application states and scenario kinds.
- Use `unknown` for untrusted input, then validate and narrow it before use. Do not use `any`.
- Prefer immutable data: `readonly` properties and arrays where mutation is not part of the contract.
- Represent expected failures with explicit result values or discriminated outcomes; reserve thrown errors for exceptional failures.
- Avoid type assertions. If one is unavoidable at a proven boundary, isolate it, document why it is safe, and keep it local.
- Do not use numeric or string literals without a meaningful named constant when the value represents a domain rule or threshold.

## 4. React Standards

- Use functional components and hooks only.
- Keep UI components focused on rendering and user intent; place simulation, analytics, and insight logic in their domains.
- Use `useReducer` for application state transitions and Context only for narrowly scoped shared state.
- Treat reducer actions as explicit events with typed payloads.
- Keep effects for synchronization with the outside world, timers, or rendering integration; do not use them to derive state that can be calculated during rendering or in selectors.
- Keep props minimal and intention-revealing. Prefer a small view model over passing raw domain state through many components.
- Use stable keys based on domain identifiers, never array indexes for dynamic lists.
- Memoize only after identifying a real rendering or computation cost; correctness and clarity come first.
- Ensure interactive elements have clear labels and keyboard-operable native controls where practical for the MVP.

## 5. Component Design

- Place components in `src/presentation/interface/` or `src/presentation/scene/` according to what they render.
- Each component owns one visual concern: for example, scenario controls, an impact panel, or a vehicle layer.
- Accept display-ready projection data and callbacks for user intent. Components must not directly invoke simulation engines, analytics rules, or scenario-effect implementations.
- Keep 3D scene objects and interface panels separate; coordinate them through the presentation projection.
- Extract a child component when it has a distinct responsibility, a meaningful name, or independent test value—not merely because a file reaches an arbitrary length.
- Prefer composition over boolean-heavy "do everything" components.
- Keep styles local to the component or presentation feature they serve.

## 6. Function Design

- Name functions with a verb and a domain noun: `advanceSimulation`, `validateScenario`, `deriveImpactSummary`.
- Do one thing per function. Split a function when it validates, transforms, mutates, and presents multiple concerns.
- Prefer pure functions for domain logic. Given the same input, simulation, routing, analytics, and fallback insight functions must return the same output.
- Keep side effects at module boundaries and name them clearly.
- Return early for invalid conditions to keep the normal path readable.
- Pass explicit inputs instead of relying on ambient mutable state.
- Keep parameters purposeful. If a function needs many related values, pass a named input object.
- Do not use boolean parameters when a descriptive union or options object makes intent clearer.

## 7. Naming Conventions

Follow the project-structure rules and use names that describe domain intent.

| Item | Convention | Example |
| --- | --- | --- |
| Variables and functions | camelCase | `selectedScenario`, `advanceSimulation` |
| Types, components, and enums | PascalCase | `SimulationSnapshot`, `ImpactPanel` |
| Constants | camelCase by default; UPPER_SNAKE_CASE only for true global constants | `maximumVehicles`, `DEFAULT_TICK_MS` |
| Boolean values | Positive question or state | `isRoadClosed`, `hasValidRoute` |
| Event handlers | `handle` + user event | `handleScenarioSelect` |
| Callback props | `on` + resulting event | `onScenarioSelect` |
| Files and directories | kebab-case, except component files | `road-closure.ts`, `ScenarioControls.tsx` |

Avoid vague terms such as `data`, `item`, `thing`, `helper`, `utils`, `common`, and `manager` unless a narrower name is genuinely impossible.

## 8. File Organization

- Follow the domain-first layout in `PROJECT_STRUCTURE.md`.
- Keep implementation close to its domain: district data in `district/`, route logic in `simulation/routing/`, impact rules in `analytics/rules/`, and fallback language in `insights/fallback/`.
- One file should have one primary concern. Split only when the split produces meaningful, independently understandable responsibilities.
- Keep tests beside the behavior they verify; keep shared test factories in the approved test-support directories.
- Expose cross-domain APIs only through a module's public `index.ts`.
- Do not create global technology buckets such as `components/`, `hooks/`, `services/`, or `utils/`.
- Do not put domain behavior in configuration files, visual assets, or presentation modules.

## 9. Import Rules

- Respect the dependency direction in `SYSTEM_ARCHITECTURE.md` and `PROJECT_STRUCTURE.md`.
- `app` may orchestrate domains. Domain modules must not import `app` or presentation code.
- Presentation may consume public domain contracts and projections but cannot import simulation engines, routing rules, analytics rules, or scenario-effect implementations.
- Import cross-domain code only from its public entry point, for example `@/simulation`, never a sibling module's internal file.
- Use the `@/` alias for source imports and relative imports only within the same module.
- Use `import type` whenever an import is only needed for type checking.
- Order imports: external packages, `@/` imports, then relative imports; separate groups with blank lines.
- Never import from tests in production code.
- Resolve a potential circular import by extracting a small shared contract into `core/contracts/` or moving coordination into `app/`.

## 10. Error Handling

- Validate scenario input and external or untrusted values at their boundary.
- Use explicit, typed failure results for expected problems, such as an unsupported scenario or unavailable route.
- Preserve the last valid application and simulation state when a transition fails.
- Provide a reset or retry path for user-recoverable failures.
- Keep deterministic fallback insights for every supported scenario; an optional insight-generation failure must not block the demo.
- Show concise, actionable user messages. Keep internal error details out of the interface.
- Never silently fabricate a successful simulation, analytic result, or insight after an invalid input or failure.

## 11. Logging

- Use logging only for actionable diagnostics during development or a demo failure.
- Log structured context: component or module, state, scenario identifier, and error category. Do not log raw mutable objects indiscriminately.
- Do not leave routine debug logging in the production build.
- Never log secrets, credentials, or unnecessary user input.
- Prefer a visible, recoverable error state over relying on console output for user feedback.

## 12. Documentation & Comments

- Write self-explanatory code first; comments explain *why*, not what an obvious line does.
- Document non-obvious domain assumptions, determinism requirements, performance trade-offs, and safety constraints.
- Add short documentation to public module APIs when their contract is not self-evident.
- Keep comments accurate when code changes; delete stale comments.
- Update the relevant `docs/` file when a change affects product scope, architecture, selected technologies, directory rules, or a material decision.
- Do not use comments to preserve unused code or hide unresolved design issues.

## 13. Testing Standards

- Write tests for deterministic domain behavior: scenario validation, route selection, simulation steps, analytics rules, reducer transitions, and fallback insight validation.
- Co-locate tests with the source file using the `.test.ts` or `.test.tsx` suffix.
- Use fixed inputs, fixed time values, and deterministic fixtures. Tests must not rely on live data, random values, shared mutable state, or execution order.
- Test public behavior and contracts, not private implementation details.
- For presentation, test user-visible outcomes and emitted user intent.
- Add a regression test when fixing a bug that can be represented reliably.
- Run relevant tests after each feature change and run the full test, lint, type-check, and production-build commands before considering a feature complete.
- Do not chase an arbitrary coverage percentage; prioritize the domain logic and user-critical paths.

## 14. Performance Guidelines

- Treat a smooth scene and responsive scenario transition as MVP requirements; aim for approximately 60 FPS on demonstration hardware where practical.
- Keep the district, vehicle count, scenario set, and scene assets intentionally small.
- Separate static district rendering from dynamic vehicle and scenario updates.
- Update only the state and visual elements that changed; avoid repeated analytics or insight work for unchanged inputs.
- Use bounded, deterministic simulation steps and simple weighted route selection.
- Profile before adding memoization, caching, or optimization abstractions.
- Do not perform expensive domain work inside rendering paths.
- Verify initial load and the scenario transition against the product's performance targets before demo handoff.

## 15. Git Workflow

- Work on one focused feature or documentation change at a time.
- Inspect the working tree before starting and do not overwrite unrelated user changes.
- Make small, logically coherent commits after the relevant verification passes.
- Keep the default branch releasable: no knowingly broken build, tests, or lint state.
- Rebase or merge only when required by the repository workflow; never use destructive history commands to resolve uncertainty.
- Update documentation with the implementation change it describes.
- A solo developer may commit directly, but should still review the diff and test output before committing.

## 16. Commit Message Convention

Use concise, imperative Conventional Commit-style messages:

```text
type: short description
```

Allowed types are `feat`, `fix`, `docs`, `test`, `refactor`, `style`, `chore`, and `perf`.

Examples:

```text
feat: add road closure scenario
fix: preserve baseline routes after reset
test: cover congestion impact rule
docs: define simulation module boundaries
```

Keep the subject under 72 characters, omit a trailing period, and describe the change rather than the implementation effort. Add a body only when the rationale is not apparent from the subject and diff.

## 17. Code Review Checklist

Before committing or requesting review, confirm:

- The change directly supports the MVP or an approved documentation need.
- The responsible module is clear and dependency direction is preserved.
- Types are strict; no `any`, unexplained assertion, dead code, or duplicate logic was introduced.
- User input and scenario effects are validated at the correct boundary.
- The simulation remains deterministic and presentation does not mutate domain state.
- Error and fallback behavior are appropriate for the changed path.
- Relevant tests pass, and linting, type checking, and the production build are clean.
- The 3D scene remains responsive for the affected flow.
- Names, comments, and documentation remain accurate.

## 18. Definition of Done

A feature is done when:

1. Its behavior is within the agreed MVP scope and aligns with the architecture.
2. It has a clear responsible module and no circular or presentation-to-domain dependency violation.
3. Its normal, invalid, and fallback paths are implemented as appropriate.
4. Deterministic domain behavior and user-visible changes have relevant tests.
5. Linting, formatting, type checking, tests, and production build pass.
6. It has been checked in the running demo for correct visual behavior and acceptable responsiveness.
7. Documentation is updated when the change affects an established decision or user-facing behavior.
8. The diff has been reviewed for scope, readability, and unintended changes.

## 19. Anti-Patterns to Avoid

- Putting simulation, routing, or analytics logic inside components or rendering callbacks.
- Letting presentation state become the source of truth for domain behavior.
- Direct cross-domain imports into private sibling folders.
- Circular dependencies, shared mutable singleton state, or hidden global configuration.
- One large reducer, component, or "service" that coordinates unrelated concerns.
- Adding a library, abstraction, backend, or data source before a concrete MVP need exists.
- Using live data, random inputs, or uncontrolled time in the core demo path.
- Claiming simulated insights are real-world forecasts or safety recommendations.
- Swallowing errors, replacing failures with invented results, or leaving debug logs in the final demo.
- Optimizing before measuring or sacrificing clarity for marginal performance gains.
- Broad refactors bundled with an unrelated feature.
- Treating passing tests as sufficient when the visual demo flow has not been verified.
