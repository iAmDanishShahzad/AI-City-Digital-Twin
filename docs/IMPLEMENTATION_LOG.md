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

## M05 - Deterministic Route Selection

### Files Created

- `src/simulation/routing/shortest-path.ts` — pure Dijkstra route selection with immutable input handling and typed outcomes.
- `src/simulation/routing/shortest-path.test.ts` — deterministic routing unit tests.

### Files Modified

- `src/simulation/index.ts` — exported the public route-selection API and types.
- `docs/CHANGELOG.md` — added the M05 changelog entry.
- `docs/KNOWN_ISSUES.md` — removed the completed routing-selection deferral while retaining later simulation work.

### Public APIs Added

- `selectShortestRoute`
- `RouteSelectionInput`
- `SelectedRoute`
- `NoRouteError`
- `RouteSelectionResult`

### Tests Added

- Baseline route selection through the one closable edge.
- Alternate-route selection when the closable edge is blocked.
- Lexicographic tie-breaking independent of edge insertion order.
- Typed no-route behavior, blocked-edge exclusion, congestion weighting, immutable inputs, and repeated-call determinism.

### Deferred Until Later Milestones

- Vehicle movement, logical ticks, spawning, waiting, and congestion calculation.
- Road-closure scenario execution and re-routing orchestration.
- Analytics, deterministic insights, and all interactive or rendering changes.

## M06 - Fixed-Tick Vehicle Lifecycle

### Files Created

- `src/simulation/engine/create-initial-simulation-snapshot.ts` — immutable tick-zero snapshot factory.
- `src/simulation/engine/advance-simulation.ts` — pure fixed-tick vehicle lifecycle engine.
- `src/simulation/engine/simulation-constants.ts` — M06 tick and wait-duration constants.
- `src/simulation/engine/advance-simulation.test.ts` — deterministic lifecycle and snapshot tests.

### Files Modified

- `src/simulation/index.ts` — exported the public simulation-engine API.
- `src/simulation/model/simulation-snapshot.ts` — added the minimal `node-arrival` waiting reason required to retain a completed-edge arrival until the next tick's planning phase.
- `docs/CHANGELOG.md` — added the M06 changelog entry.
- `docs/KNOWN_ISSUES.md` — removed the completed vehicle-lifecycle deferral while retaining congestion work.

### Public APIs Added

- `createInitialSimulationSnapshot`
- `advanceSimulation`
- `SimulationAdvanceInput`

### Tests Added

- Snapshot creation, scheduled spawning, fixed-duration movement, edge completion, and node arrival.
- Destination waiting, respawning, no-route waiting, and retry behavior.
- Immutable occupancy, identifier-sorted processing, immutable snapshots, and deterministic replay.
- Global tick staging: prior-snapshot occupancy, same-tick movement after planning, and deferred node-arrival planning.

### Deferred Until Later Milestones

- Congestion calculation, congestion-weighted movement, and display classifications (M07).
- Road-closure execution, rerouting, scenario application, and reset behavior (M08).
- Presentation updates, analytics, insights, and controls.

## Post-M06 - Comparator Consolidation

### Files Created

- `src/core/compare-text.ts` — dependency-free deterministic text comparator shared by routing and simulation internals.

### Files Modified

- `src/core/index.ts` — exported the shared comparator through Core's public entry point.
- `src/simulation/routing/shortest-path.ts` — now imports the shared comparator.
- `src/simulation/engine/advance-simulation.ts` — now imports the shared comparator.
- `src/simulation/engine/create-initial-simulation-snapshot.ts` — now imports the shared comparator.
- `docs/IMPLEMENTATION_LOG.md` and `docs/REVIEW_LOG.md` — recorded this narrowly scoped cleanup.

### Public APIs Added

- `compareText` — exported through the Core public entry point. No simulation public API changed.

### Tests Added

- None. Existing routing and lifecycle tests exercise all retained comparison behavior.

### Deferred Until Later Milestones

- All M07 and later scope remains deferred unchanged.

## M07 - Deterministic Congestion

### Files Created

- `src/simulation/traffic/derive-edge-traffic.ts` — pure immutable derivation of edge occupancy, congestion multipliers, and traffic classifications.
- `src/simulation/traffic/derive-edge-traffic.test.ts` — congestion model unit tests.
- `src/simulation/engine/advance-simulation-congestion.test.ts` — staged-tick routing, movement, replay, and immutability integration tests.

### Files Modified

- `src/simulation/model/simulation-snapshot.ts` — added immutable edge-traffic conditions to the published simulation snapshot.
- `src/simulation/engine/create-initial-simulation-snapshot.ts` — publishes deterministic zero-occupancy traffic data at tick zero.
- `src/simulation/engine/advance-simulation.ts` — uses prior-snapshot traffic data for both planning and movement, then publishes traffic data for the next snapshot.
- `src/simulation/index.ts` — exported the traffic derivation API and contracts.
- `src/simulation/engine/advance-simulation.test.ts` and `src/app/application/application-reducer.test.ts` — aligned snapshot fixtures and expected effective-speed behavior with M07.
- `docs/CHANGELOG.md` and `docs/KNOWN_ISSUES.md` — recorded completion and removed the completed congestion deferral.

### Public APIs Added

- `deriveEdgeTraffic`
- `EdgeTrafficInput`
- `EdgeTrafficData`
- `EdgeTraffic`
- `EdgeTrafficCondition`
- `EdgeTrafficClassification`

### Tests Added

- Zero, half-capacity, full-capacity, and capped-multiplier traffic calculations.
- Free-flowing, busy, and congested deterministic classifications.
- Previous-snapshot occupancy integration for movement and congestion-weighted spawning route selection.
- Stable ordering, replay determinism, and immutable traffic/snapshot data.

### Deferred Until Later Milestones

- Road-closure scenario execution, blocked-edge rerouting, and reset behavior (M08).
- Dynamic rendering of vehicles and congestion conditions (M09).
- Analytics, deterministic insights, and controls.

## M07 - Congestion Tick-Calculation Correction

### Files Modified

- `src/simulation/engine/advance-simulation.ts` — removed the post-movement traffic derivation and publishes the immutable pre-movement traffic result used by routing and movement.
- `src/simulation/engine/advance-simulation-congestion.test.ts` — added coverage proving published traffic remains the pre-movement result when a vehicle completes an edge.
- `docs/CHANGELOG.md`, `docs/IMPLEMENTATION_LOG.md`, and `docs/REVIEW_LOG.md` — recorded the focused M07 repair.

### Public APIs Added or Changed

- None.

### Tests Added

- Published edge occupancy and traffic conditions remain the single pre-movement calculation for the completed tick.

### Deferred Until Later Milestones

- M08 closure behavior, rerouting, and reset; M09 rendering; analytics, insights, and controls remain unchanged.

## M07 - Traffic Derivation Efficiency Correction

### Files Modified

- `src/simulation/traffic/derive-edge-traffic.ts` — passes the single pre-sorted edge collection to the occupancy helper during traffic derivation.
- `docs/CHANGELOG.md`, `docs/IMPLEMENTATION_LOG.md`, and `docs/REVIEW_LOG.md` — recorded the focused efficiency repair.

### Public APIs Added or Changed

- None.

### Tests Added

- None. Existing deterministic traffic, lifecycle, and replay tests retain identical observable behavior.

### Deferred Until Later Milestones

- M08 closure behavior, rerouting, and reset; M09 rendering; analytics, insights, and controls remain unchanged.

## M07 - Snapshot Occupancy Timing Correction

### Files Modified

- `src/simulation/traffic/derive-edge-traffic.ts` — extracted immutable occupancy-only derivation without recalculating congestion or classifications.
- `src/simulation/engine/advance-simulation.ts` — publishes post-movement occupancy while retaining pre-movement traffic conditions for the completed tick.
- `src/simulation/engine/advance-simulation-congestion.test.ts` and `src/simulation/engine/advance-simulation.test.ts` — verified the distinct occupancy and traffic timing responsibilities.
- `docs/CHANGELOG.md`, `docs/IMPLEMENTATION_LOG.md`, and `docs/REVIEW_LOG.md` — recorded the focused repair.

### Public APIs Added or Changed

- None.

### Tests Added

- Updated the traffic-publication regression test to confirm completed vehicles leave published occupancy while published traffic remains the pre-movement calculation.

### Deferred Until Later Milestones

- M08 closure behavior, rerouting, and reset; M09 rendering; analytics, insights, and controls remain unchanged.

## M08 - Road-Closure Scenario and Reset

### Files Created

- `src/scenarios/catalog/central-road-closure.ts` — the single immutable MVP road-closure definition.
- `src/scenarios/catalog/validate-scenario-definition.ts` and `src/scenarios/model/scenario-validation.ts` — typed, dependency-safe scenario validation.
- `src/scenarios/effects/create-scenario-effect.ts` — serializable closure-effect construction.
- `src/simulation/engine/schedule-road-closure.ts` — next-tick, idempotent closure scheduling.
- `src/simulation/engine/reset-simulation.ts` — fresh deterministic reset factory.
- `src/simulation/engine/road-closure.test.ts` — M08 behavior coverage.

### Files Modified

- `src/scenarios/index.ts` — exports the minimal scenario catalog, validation, and effect APIs.
- `src/simulation/model/simulation-snapshot.ts` — records the immutable closed-edge value on scenario events.
- `src/simulation/engine/advance-simulation.ts` — applies scheduled closures before occupancy, preserves in-progress travel, excludes closed edges from replanning, and discards affected remaining routes.
- `src/simulation/index.ts` — exports closure scheduling and reset operations.
- `docs/CHANGELOG.md` and `docs/KNOWN_ISSUES.md` — recorded M08 completion and removed its completed deferral.

### Public APIs Added

- `centralRoadClosureScenario`
- `validateScenarioDefinition`
- `createScenarioEffect`
- `scheduleRoadClosure`
- `RoadClosureScheduleInput`
- `resetSimulation`
- `ScenarioValidationError`
- `ScenarioValidationErrorCode`

### Tests Added

- Valid scenario validation, one-tick scheduling, active-selection idempotency, in-progress closed-edge traversal, node-arrival-only rerouting, closure-driven no-route waiting, reset replay, and immutable scenario snapshots.

### Deferred Until Later Milestones

- Dynamic vehicle, congestion, and closure rendering (M09).
- Baseline comparison and analytics (M10–M11).
- Deterministic insights and interactive scenario controls (M12–M13).
