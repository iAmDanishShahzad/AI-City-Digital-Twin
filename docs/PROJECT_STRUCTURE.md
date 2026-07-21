# AI City Digital Twin: Project Structure

## Purpose

This structure keeps the MVP organized around product domains and architectural responsibilities rather than a collection of technical file types. It supports a small, deterministic city-district simulation now, while leaving clear places for future scenarios, districts, and analysis without coupling the simulation to the interface.

Only create a folder when it owns a clear responsibility. The MVP should not create empty folders merely to anticipate possible features.

## 1. High-Level Directory Tree

```text
AI-City-Digital-Twin/
|-- .github/
|   `-- workflows/
|       `-- deploy.yml
|-- docs/
|   |-- CODEX_GOAL.md
|   |-- PRODUCT_VISION.md
|   |-- SYSTEM_ARCHITECTURE.md
|   |-- TECH_STACK.md
|   |-- PROJECT_STRUCTURE.md
|   `-- [future decision and product documents]
|-- public/
|   `-- [static files served unchanged]
|-- src/
|   |-- app/
|   |   |-- application/
|   |   |   |-- application-state.ts
|   |   |   |-- application-reducer.ts
|   |   |   |-- orchestrator.ts
|   |   |   |-- selectors.ts
|   |   |   `-- App.tsx
|   |-- core/
|   |   |-- contracts/
|   |   |-- errors/
|   |   `-- result/
|   |-- district/
|   |   |-- catalog/
|   |   |-- model/
|   |   `-- fixtures/
|   |-- scenarios/
|   |   |-- catalog/
|   |   |-- effects/
|   |   `-- model/
|   |-- simulation/
|   |   |-- engine/
|   |   |-- model/
|   |   |-- routing/
|   |   `-- traffic/
|   |-- analytics/
|   |   |-- model/
|   |   `-- rules/
|   |-- insights/
|   |   |-- fallback/
|   |   |-- model/
|   |   `-- validation/
|   |-- presentation/
|   |   |-- projection/
|   |   |-- scene/
|   |   `-- interface/
|   |-- assets/
|   |   |-- icons/
|   |   |-- textures/
|   |   `-- audio/
|   `-- test/
|       |-- factories/
|       |-- helpers/
|       `-- setup.ts
|-- .editorconfig
|-- .gitignore
|-- eslint.config.js
|-- index.html
|-- package.json
|-- package-lock.json
|-- prettier.config.js
|-- README.md
|-- tsconfig.json
`-- vite.config.ts
```

The tree illustrates the intended structure; a directory is created only once its responsibility is implemented.

## 2. Purpose of Every Top-Level Directory

| Directory | Purpose |
| --- | --- |
| `.github/` | Repository automation only, including static-site deployment workflow. |
| `docs/` | Durable product, architecture, technical, and contributor documentation. |
| `public/` | Small static files that must be served unchanged and are not imported by source modules. |
| `src/` | All application source, domain logic, presentation code, source-managed assets, and test support. |

Root configuration files configure the build, typing, linting, formatting, package scripts, and editor consistency. They must not contain product logic.

## 3. Responsibilities of Important Subdirectories

### `src/app/`

The composition root. It initializes the application, owns application-level state transitions, and coordinates the domain flow described in `SYSTEM_ARCHITECTURE.md`. It may depend on all public domain APIs and presentation entry points, but domain modules must never depend on `app`.

### `src/core/`

Small, dependency-free cross-cutting primitives that do not belong to a product domain: result types, domain-error shapes, and narrowly shared contracts. This is not a general dumping ground for arbitrary utilities.

### `src/district/`

Owns immutable district source data: the road graph, named areas, baseline vehicles, and district display metadata. `catalog/` supplies the MVP district; `model/` defines its domain types; `fixtures/` holds compact test variations.

### `src/scenarios/`

Owns supported disruption definitions and validation. `catalog/` exposes selectable scenarios; `effects/` translates a valid scenario into a serializable domain effect; `model/` defines scenario and effect types. It does not run simulation steps.

### `src/simulation/`

Owns the deterministic traffic simulation. `engine/` advances snapshots; `routing/` contains route selection and shortest-path behavior; `traffic/` defines movement and congestion rules; `model/` defines simulation state and input/output contracts. It has no presentation imports.

### `src/analytics/`

Owns the transformation of baseline and current simulation snapshots into supported impact facts. `rules/` implements transparent derivations and thresholds; `model/` defines analytics results. It must not generate user-facing prose.

### `src/insights/`

Owns explanation construction and validation. `fallback/` holds deterministic scenario-specific insight content; `validation/` confirms that any optional generated text is consistent with supplied impact facts; `model/` defines insight contracts. It must never alter simulation or analytics output.

### `src/presentation/`

Owns the read-only transformation of application and domain data into visible output. `projection/` creates display-ready view data; `scene/` renders the 3D district and dynamic vehicles; `interface/` renders controls, status, and insights. It sends user intents to `app` but does not perform domain calculations.

### `src/assets/` and `public/`

`src/assets/` holds small source-managed visual or audio assets imported by application code. `public/` is reserved for files that must retain an exact public path. Neither directory may contain domain data, scenario definitions, or large unoptimized media.

### `src/test/`

Holds shared test setup, factories, and helpers only. Tests themselves live beside the module they test so that behavior and coverage evolve together.

## 4. Dependency Direction Rules

Dependencies must move inward toward stable domain contracts, never outward toward application composition or presentation.

```text
app --> presentation
app --> insights --> analytics --> simulation --> district
app --> scenarios

presentation --> public domain types and presentation projections only
scenarios --> core
district --> core
simulation --> district, core
analytics --> simulation, scenarios, core
insights --> analytics, scenarios, core
core --> no project module
```

Rules:

- `app` is the only module allowed to orchestrate multiple domains.
- `presentation` may read domain data through public contracts or projections, but it may not import an engine, routing rule, analytics rule, or scenario effect implementation.
- `simulation` accepts scenario effects as values; it must not import the scenario catalog.
- `analytics` consumes snapshots and context but cannot mutate them.
- `insights` consumes validated analytics facts and scenario context but cannot change their meaning.
- No module may import from a parent directory, a sibling's internal directory, or the test-support directory at runtime.

## 5. Module Boundaries

Each domain directory is a module. Its public surface is an `index.ts` file that exports only the contracts and operations other modules need.

```text
src/simulation/
|-- engine/
|-- routing/
|-- model/
|-- index.ts        # permitted public API
`-- simulation.test.ts
```

- Internal folders are private implementation details.
- Cross-domain calls use immutable values and explicit return types, never shared mutable objects.
- A module exposes commands, queries, types, or value factories; it does not expose its folder layout.
- `app` owns cross-domain workflows; no domain module acts as an implicit coordinator.
- Presentation receives projection data, not live mutable domain state.

If a new feature requires two domains to import each other, extract the shared contract into `core/contracts/` or move orchestration into `app/`; do not introduce a circular dependency.

## 6. Import Conventions

- Use the `@/` alias for source imports, for example `@/simulation` or `@/district`.
- Import another domain only from its public module entry point: `@/analytics`, never `@/analytics/rules/congestion-rule`.
- Prefer relative imports only within the same module and only for nearby files.
- Use `import type` for type-only dependencies.
- Keep imports ordered: external packages, `@/` modules, then relative modules, with a blank line between groups.
- Do not use barrel files inside private subdirectories. One public `index.ts` per module is sufficient for the MVP.
- Avoid default exports for domain functions and types; use named exports for clearer refactoring and searching.

## 7. File Naming Conventions

Use lowercase kebab-case for source filenames and descriptive suffixes for roles.

| Kind | Convention | Example |
| --- | --- | --- |
| Domain type | `*.ts` or `*.types.ts` | `simulation-state.ts` |
| Domain operation | `verb-noun.ts` | `advance-simulation.ts` |
| Rule | `noun-rule.ts` | `congestion-rule.ts` |
| Catalog | `noun-catalog.ts` | `district-catalog.ts` |
| Projection | `noun-projection.ts` | `district-projection.ts` |
| UI component | PascalCase `.tsx` | `ScenarioControls.tsx` |
| Style module | component-name `.module.css` | `scenario-controls.module.css` |
| Unit or component test | source name plus `.test` | `advance-simulation.test.ts` |
| Test factory | `create-noun.ts` | `create-simulation-snapshot.ts` |

Names must describe domain intent rather than a temporary implementation detail. Avoid vague names such as `helpers.ts`, `utils.ts`, `common.ts`, or `manager.ts`.

## 8. Folder Naming Conventions

- Use lowercase kebab-case for all directories: `scenario-effects/`, not `ScenarioEffects/`.
- Name folders for the bounded responsibility they contain, not the technology they use.
- Prefer a flat module until files no longer share one focused responsibility; then introduce a named subdirectory.
- Do not create global `components/`, `hooks/`, `services/`, or `utils/` directories. Place such code inside the responsible domain or presentation area.
- Do not duplicate domain names in every child folder. For example, `simulation/routing/` is clearer than `simulation/simulation-routing/`.

## 9. Asset Organization

- Keep importable assets under `src/assets/`, grouped by asset kind (`icons/`, `textures/`, `audio/`).
- Use descriptive kebab-case filenames such as `road-closure-marker.svg` and `asphalt-base.png`.
- Keep static district geometry and scenario definitions in their domain modules, not in asset folders.
- Optimize and limit assets for the demo; avoid large model libraries, duplicated media, or untracked binary originals.
- Use `public/` only for stable-path files such as a site icon or deployment metadata. Reference it by public path only when importing it into the source pipeline is inappropriate.

## 10. Test Organization

- Co-locate unit and component tests with the code they verify: `routing/shortest-path.test.ts` beside `routing/shortest-path.ts`.
- Put reusable fixtures and factories in the owning domain's `fixtures/` directory when they express domain data; put broadly reusable test builders in `src/test/factories/`.
- Keep test setup and renderer configuration in `src/test/setup.ts`.
- Prioritize tests for scenario validation, route selection, simulation steps, analytics rules, application reducer transitions, and insight fallback validation.
- Test presentation through user-visible input and output; do not test private implementation structure.
- Use deterministic fixtures and fixed time inputs. No test may depend on live network data, random values, or a previous test's mutable state.

## 11. Documentation Organization

`docs/` is the authoritative home for project decisions and implementation guidance:

| Document | Responsibility |
| --- | --- |
| `CODEX_GOAL.md` | Engineering mission, workflow, and non-negotiable quality principles. |
| `PRODUCT_VISION.md` | Product definition, scope, user needs, and demo story. |
| `SYSTEM_ARCHITECTURE.md` | Implementation-independent component boundaries and data flow. |
| `TECH_STACK.md` | Selected MVP technologies and intentional exclusions. |
| `PROJECT_STRUCTURE.md` | Directory, dependency, naming, and module-boundary rules. |
| `DECISIONS.md` | Short, dated records of material decisions and their rationale. |
| `GLOSSARY.md` | Shared domain vocabulary used consistently across code and documentation. |
| `ROADMAP.md` and `MILESTONES.md` | Ordered delivery scope and verification checkpoints. |

Update the applicable document in the same change as any material change to scope, architecture, stack, or structure.

## 12. Future Expansion Strategy

The MVP starts with one district and a small scenario set. Expand by adding bounded modules rather than broad shared directories:

1. Add a scenario by extending `scenarios/catalog/` and `scenarios/effects/`, then supply the matching analytics rules, fallback insight, tests, and presentation labels.
2. Add a district by adding a new catalog and fixtures under `district/`; the simulation contract remains unchanged.
3. Add a new impact category within `analytics/` and expose it through a versioned public analytics contract before adding it to insights or presentation.
4. Add optional insight providers behind the existing `insights/` contract while retaining deterministic fallback content.
5. Split a module only when it has a clear independent responsibility or test boundary; do not pre-create enterprise layers, packages, or services.

Every expansion must preserve inward dependency direction, avoid circular imports, keep the deterministic demo path intact, and justify its cost against the product scope.
