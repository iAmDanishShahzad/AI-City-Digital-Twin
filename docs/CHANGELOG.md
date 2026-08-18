# Changelog

## M08 - Road-Closure Scenario and Reset

- Added the validated Central District road-closure scenario and a serializable closure effect.
- Added next-tick closure scheduling, idempotent selection, closed-edge route exclusion, deterministic rerouting, and immutable application events.
- Added deterministic simulation reset that recreates a fresh normal-state snapshot.
- Added scenario tests for scheduling, closure activation, in-progress traversal, rerouting, no-route waiting, reset, replay, and immutability.

## M01 - Project Toolchain

- Initialized the Vite, React, and TypeScript project foundation.
- Configured ESLint, Prettier, and Vitest with Testing Library.
- Added strict TypeScript compiler configuration and the `@/` source alias.
- Added a minimal application shell and initial component test.
- Verified the production build, linting, formatting, tests, and type checking.

## M02 - Domain Contracts and Application State

- Added immutable contracts for district, scenario, simulation, analytics, and insight data.
- Added shared result and recoverable application-error contracts.
- Added typed application states, actions, and reducer transitions.
- Added reducer tests for the valid flow, reset, and error recovery.

## M03 - District Catalog and Graph Validation

- Added the immutable eight-node Central District catalog with 16 directed edges and one closable edge.
- Added deterministic baseline vehicles, named areas, and emergency and delivery probes.
- Added typed catalog validation for graph limits, references, identifiers, vehicle/probe definitions, and the required alternate-route demonstration.
- Added deterministic catalog validation tests.
- Added a Mermaid district-graph reference for future routing and scenario verification.

## M04 - Baseline District Projection and Scene

- Added an immutable district-to-presentation projection that separates the renderer from the district catalog.
- Added a responsive static 3D district scene with geometric roads, intersections, landmarks, lighting, and orbit camera controls.
- Refined the fictional district layout with a north-up camera, readable node and landmark labels, primary/alternative road hierarchy, and a compact gridded city block.
- Aligned the static scene coordinates with `DISTRICT_GRAPH.md`: the documented main corridor is straight and the documented alternative route is visibly distinct.
- Added focused projection and canvas-boundary component tests.
- Verified production build, type checking, linting, formatting, tests, and the production-only dependency audit.

## M05 - Deterministic Route Selection

- Added a pure Dijkstra shortest-path service for immutable district graphs.
- Added blocked-edge filtering and congestion-weighted route costs with a default multiplier of one.
- Added deterministic lexicographic edge-ID tie-breaking and typed no-route results.
- Added focused unit tests for baseline and alternate paths, blocked edges, congestion, disconnected graphs, immutability, and repeatability.

## M06 - Fixed-Tick Vehicle Lifecycle

- Added immutable tick-zero simulation snapshot creation for the deterministic baseline roster.
- Added a pure fixed-tick simulation engine for scheduled spawning, movement, node arrival, waiting, retry, and respawn behavior.
- Added immutable edge-occupancy calculation and ascending vehicle-ID processing.
- Added lifecycle tests for deterministic replay, snapshot immutability, and all required vehicle transitions.
- Refined the engine into explicit global tick phases: previous-snapshot occupancy, flat M06 multipliers, planning, movement, arrival resolution, waiting, and immutable publication.

## Post-M06 - Core Import Boundary

- Exported the existing deterministic text comparator through the Core public entry point.
- Updated routing and simulation to consume the comparator through `@/core`, preserving the documented module boundary.

## M07 - Deterministic Congestion

- Added immutable, previous-snapshot edge-traffic derivation for occupancy, congestion multipliers, and visual classifications.
- Applied the same deterministic congestion multiplier to both route selection and vehicle movement during each tick.
- Added the documented free-flowing, busy, and congested classifications without rendering behavior.
- Added focused tests for zero, partial, full, and capped occupancy; route-cost integration; movement slowdown; replay determinism; ordering; and immutability.

## M07 - Congestion Tick-Calculation Correction

- Reused the single immutable pre-movement edge-traffic result for route selection, movement, and snapshot publication.
- Removed the post-movement traffic derivation so each logical tick performs one congestion calculation.

## M07 - Snapshot Occupancy Timing Correction

- Kept the single pre-movement traffic calculation for route cost, movement speed, and published traffic conditions.
- Added a separate post-movement occupancy-only derivation so each snapshot's vehicle and occupancy state remain consistent.

## M07 - Traffic Derivation Efficiency Correction

- Reused the single ordered edge collection while deriving pre-movement occupancy and traffic conditions.
- Removed duplicate edge sorting without changing simulation behavior or public APIs.
