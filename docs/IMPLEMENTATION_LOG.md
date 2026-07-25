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

## M03 - District Catalog and Graph Validation

### Files Created

- `src/district/catalog/central-district.ts` — immutable Central District source data.
- `src/district/catalog/district-constraints.ts` — fixed catalog limits and vehicle constants.
- `src/district/catalog/validate-district-definition.ts` — typed, non-throwing catalog validation.
- `src/district/catalog/validate-district-definition.test.ts` — catalog validation tests.
- `src/district/model/district-validation.ts` — validation error contracts.
- `docs/DISTRICT_GRAPH.md` — Mermaid graph, edge, closable-edge, and probe reference.

### Files Modified

- `src/district/index.ts` — exported the catalog, validator, and validation contracts.
- `docs/CHANGELOG.md` — added the M03 changelog entry.
- `docs/KNOWN_ISSUES.md` — removed the completed district-catalog deferral.

### Public APIs Added

- `centralDistrictDefinition`
- `validateDistrictDefinition`
- `DistrictValidationError`
- `DistrictValidationErrorCode`

### Tests Added

- Valid immutable catalog acceptance.
- Rejection of duplicate IDs, missing references, invalid edge values, invalid vehicle/probe data, and missing alternate routes.

### Deferred Until Later Milestones

- Weighted route selection and tie breaking (M05).
- Simulation, congestion, road-closure behavior, analytics, insights, and rendering.

## M04 - Baseline District Projection and Scene

### Files Created

- `src/presentation/projection/district-projection.ts` — immutable district-to-view projection and typed projection failures.
- `src/presentation/projection/district-projection.test.ts` — projection completeness and failure tests.
- `src/presentation/scene/DistrictScene.tsx` — static district canvas, ground, roads, intersections, landmarks, lighting, and camera controls.
- `src/presentation/scene/DistrictScene.module.css` — responsive scene container styles.
- `src/presentation/scene/DistrictScene.test.tsx` — canvas-boundary component test.
- `src/presentation/index.ts` — public presentation module entry point.

### Files Modified

- `src/app/App.tsx` — composes the immutable district catalog with its presentation projection and static scene.
- `src/app/App.module.css` — provides the responsive baseline-scene shell.
- `src/app/App.test.tsx` — verifies the static baseline view is composed by the application shell.
- `src/district/catalog/central-district.ts` — refined only the immutable display coordinates to create a balanced north-up district layout; graph topology and simulation values are unchanged.
- The display coordinates now mirror `DISTRICT_GRAPH.md`: `NG → CS → MK → HP → EH` forms the straight primary corridor, while `CS → RV → WH → EH` forms the distinct alternative path.
- `src/presentation/projection/district-projection.ts` — added display labels and presentational primary/secondary road categories.
- `src/presentation/scene/DistrictScene.tsx` and `DistrictScene.module.css` — added node and landmark labels, road hierarchy styling, a compact gridded ground plane, north-up camera framing, and a non-overlapping legend.
- `docs/CHANGELOG.md` — added the M04 changelog entry.
- `docs/KNOWN_ISSUES.md` — removed the completed rendering deferral.

### Public APIs Added

- `projectDistrict`
- `DistrictProjection`
- `DistrictProjectionError`
- `DistrictScene`

### Tests Added

- Projection includes every catalog node, edge, and named area as display-ready output.
- Projection returns a typed failure for an unpositioned node.
- The scene mounts through its canvas boundary without component errors in the test environment.
- The local browser preview confirms that the full labelled district is visible in one frame with no console errors.
- Projection tests lock the north-up main-corridor and alternative-route display layout to the documented graph reference.

### Deferred Until Later Milestones

- Routing, vehicle movement, simulation, congestion, and road-closure behavior.
- Dynamic vehicles, congestion indicators, and closure markers (M09).
- Analytics, insights, and scenario controls.
