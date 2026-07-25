# Changelog

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
