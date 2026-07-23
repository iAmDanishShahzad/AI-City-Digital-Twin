# Implementation Log

This document records completed implementation activities in a review-friendly format. Each implementation entry identifies the files and public APIs introduced, tests added, and intentionally deferred scope.

## M01 - Project Toolchain

### Files Created

- `package.json` and `package-lock.json`.
- Vite, TypeScript, ESLint, and Prettier configuration files.
- `index.html`.
- Minimal React entry point under `src/`.
- Initial application shell and component test.
- Vitest setup file.
- `.editorconfig` and `.prettierignore`.

### Files Modified

- `.gitignore` — added local npm cache exclusion.

### Public APIs Added

- None. M01 established the development toolchain and minimal application shell only.

### Tests Added

- Initial component test confirming that the application title renders.

### Deferred Until Later Milestones

- Domain contracts and application state, completed in M02.
- District data and graph validation.
- Rendering, routing, simulation, scenarios, analytics, insights, and interactive controls.

## M02 - Domain Contracts and Application State

### Files Created

- `src/core/` — shared identifiers, result, and recoverable error contracts.
- `src/district/` — immutable district and vehicle-definition contracts.
- `src/scenarios/` — scenario-definition and effect contracts.
- `src/simulation/` — snapshot, route, vehicle-state, and event contracts.
- `src/analytics/` — analytics summary contracts.
- `src/insights/` — insight contract.
- `src/app/application/` — application state model, typed reducer, actions, and tests.

### Files Modified

- `docs/CHANGELOG.md` — added the M02 changelog entry.

### Public APIs Added

- Public `index.ts` exports for each domain module.
- Immutable models for all documented M02 data boundaries.
- `applicationReducer`, `ApplicationAction`, `ApplicationState`, and `initialApplicationState`.

### Tests Added

- Reducer valid transition flow: initializing → ready → applying scenario → simulating → analyzing → ready.
- Reset to a supplied baseline session.
- Recoverable error preservation and recovery of the last valid state.

### Deferred Until Later Milestones

- District catalog and validation.
- Routing and simulation behavior.
- Scenario validation and effects.
- Analytics calculations.
- Insight generation.
- Rendering and user controls.
