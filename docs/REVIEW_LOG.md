# Review Log

This document records completed project reviews. Add a new entry after every future review, identifying the milestone context, scope, findings, corrective action, and verification result.

## Review After M01 Toolchain Implementation

**Date:** 2026-07-23

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed to M02.

### Scope

- Compared the Vite, React, TypeScript, ESLint, Prettier, and Vitest configuration with `TECH_STACK.md`.

### Findings

- The configured toolchain matched the selected stack.
- Three.js and React Three Fiber were selected for later rendering work and were not needed by M01.

### Action

- No configuration correction was required during the stack-alignment review.

### Verification

- The initial development server, build, typecheck, lint, formatting check, and test run passed.

## Code Review After M01 Toolchain Implementation

**Date:** 2026-07-23

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved after dependency cleanup

**Approved:** Yes

**Issues:** Unneeded 3D rendering packages were present before their M04 use.

**Follow-up:** Proceed to M02 with rendering packages deferred until M04.

### Scope

- Searched source and configuration for typed `any` and unfinished-work markers.
- Reviewed dependencies for M01 necessity.
- Checked the created source folders against `PROJECT_STRUCTURE.md`.

### Findings

- No typed `any` or unfinished-work markers were present.
- The initial 3D rendering packages were unnecessary before M04.
- `src/app` and `src/test` matched the documented M01 structure.

### Action

- Removed `three`, `@react-three/fiber`, and `@types/three` from the manifest and lockfile. They remain selected technologies to add when rendering begins.

### Verification

- Typecheck, lint, formatting check, test run, and production build passed after cleanup.

## Review After M02 Domain Contracts and Application State Implementation

**Date:** 2026-07-23

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed to the M02 code review, then M03.

### Scope

- Compared the current Vite, React, TypeScript, ESLint, Prettier, Vitest, and Testing Library setup with `TECH_STACK.md`.

### Findings

- The configured toolchain matched the documented M02 needs.
- Three.js and React Three Fiber remained intentionally deferred because M02 contains no rendering work.

### Action

- No stack configuration change was required.

### Verification

- The M02 typecheck, lint, test run, formatting check, and production build passed.

## Code Review After M02 Domain Contracts and Application State Implementation

**Date:** 2026-07-23

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved after dependency cleanup

**Approved:** Yes

**Issues:** `@testing-library/user-event` was unused by M01 and M02.

**Follow-up:** Proceed to M03; add the package only if a later UI test needs it.

### Scope

- Searched source and configuration for typed `any` and unfinished-work markers.
- Reviewed dependencies against completed M01 and M02 scope.
- Checked all created domain-model folders against `PROJECT_STRUCTURE.md`.

### Findings

- No typed `any` or unfinished-work markers were present.
- All M02 folders matched documented domain and model boundaries.
- `@testing-library/user-event` was not configured or used by M01 or M02.

### Action

- Removed `@testing-library/user-event` from the manifest and lockfile. Add it only if a later UI test requires it.

### Verification

- Typecheck, lint, test run, and production build passed after cleanup.

## Code Review After M02 Documentation Updates

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** Historical review-log prose contained literal unfinished-work marker names, creating false positives in project-wide scans.

**Follow-up:** Proceed to M03. Record future deferred work in `KNOWN_ISSUES.md` and future reviews in this log.

### Scope

- Searched source and configuration for typed `any` and unfinished-work markers.
- Reviewed dependencies against completed M01 and M02 scope.
- Checked current source folders against `PROJECT_STRUCTURE.md`.

### Findings

- No typed `any` or unfinished-work markers remain in the project.
- All configured dependencies are required by the M01 toolchain or its active M02 test and type contracts.
- All current source folders match documented module boundaries.

### Action

- Replaced the historical literal marker names in this log with a generic description to keep future scans accurate.

### Verification

- The project-wide marker scan produced no source or configuration violations.

## Toolchain Security Advisory Review After M02

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved with follow-up

**Approved:** Yes

**Issues:** `npm audit` reports five high-severity transitive advisories for development-only `brace-expansion` packages via ESLint and the TypeScript ESLint parser toolchain.

**Follow-up:** Do not run `npm audit fix --force` during active MVP development. Re-evaluate supported updates after M14, as recorded in `KNOWN_ISSUES.md`.

### Scope

- Reviewed `package.json`, `package-lock.json`, `npm audit` output, and `npm ls brace-expansion` output.

### Findings

- The vulnerable paths are reachable only through direct development dependencies: ESLint and `typescript-eslint`.
- The runtime dependency set contains only React and React DOM.
- The audit tool reports no supported non-breaking automatic remediation; its offered fix upgrades ESLint to a new major version.

### Action

- No package or lockfile change was made.
- Added the advisory to `KNOWN_ISSUES.md` with its mitigation and deferral rationale.

### Verification

- Confirmed the lockfile marks both vulnerable dependency paths as development-only.

## Review After M03 District Catalog and Graph Validation Implementation

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed to M04 or M05 according to the milestone plan; do not implement routing before M05.

### Scope

- Reviewed the immutable Central District catalog and typed validation rules against the simulation specification.
- Confirmed the catalog has eight nodes, 16 directed edges, one closable edge, ten deterministic vehicles, and two valid probes.
- Confirmed no M02 contract was modified.

### Findings

- The validator returns typed results for expected failures and does not implement weighted route selection or simulation behavior.
- Tests cover all required M03 validation failure classes.
- The production dependency audit reports zero vulnerabilities.

### Action

- No follow-up correction was required after verification.

### Verification

- Typecheck, lint, tests, formatting check, and production build passed.
- `npm audit --omit=dev` reported zero vulnerabilities.

## Toolchain Review After M03 Documentation Updates

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed according to the milestone plan; add Three.js and React Three Fiber only when M04 rendering begins.

### Scope

- Compared the Vite, React, TypeScript, ESLint, Prettier, Vitest, and Testing Library configuration with `TECH_STACK.md`.

### Findings

- The installed configuration matches the selected M03 toolchain.
- Three.js and React Three Fiber remain selected but intentionally uninstalled until M04, where they are first required.

### Action

- No configuration changes required.

### Verification

- Confirmed package scripts, Vite test configuration, strict TypeScript settings, ESLint rules, and Prettier configuration.

## Code Review After M03 District Catalog Implementation

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed according to the milestone plan.

### Scope

- Searched the project for typed `any` and unfinished-work markers.
- Reviewed all manifest dependencies against M01 toolchain needs and active M02/M03 use.
- Compared the current source tree with `PROJECT_STRUCTURE.md`.

### Findings

- No typed `any` or unfinished-work markers exist in the project.
- Every manifest dependency supports the configured Vite, React, TypeScript, test, lint, or formatting toolchain.
- The source tree contains only documented M01–M03 module directories; no global technology buckets or undocumented source folders were introduced.

### Action

- No package or source-structure changes required.

### Verification

- Confirmed the project-wide marker scan returned no matches.

## Milestone Verification Review After M03

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed to M04 or M05 in milestone order; retain the graph reference as the routing verification baseline.

### Scope

- Ran the full local M01–M03 verification suite.
- Reviewed the Central District topology, closable edge, alternate route, vehicle schedule, probes, and Mermaid graph reference.

### Findings

- The project builds, typechecks, lints, formats, and tests successfully; all 12 tests pass.
- The production-only audit reports zero vulnerabilities.
- The district has 8 nodes, 16 directed edges, exactly one closable edge, and 10 vehicles with fixed spawn ticks from 0 through 27.
- The north-gate to east-hub main route uses the closable edge and has a longer viable alternate through riverside and warehouse.
- The emergency probe is affected by the closure path while the delivery probe supplies a valid unaffected comparison route; both outcomes are appropriate simulation proxies.
- The Mermaid graph matches the catalog's nodes, road edges, closable edge, and probes.

### Action

- No changes required.

### Verification

- `npm run build`
- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run format:check`
- `npm audit --omit=dev`

## Review After M04 Baseline District Projection and Scene Implementation

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved with follow-up

**Approved:** Yes

**Issues:** The automated browser bridge could not initialize because the local sandbox denied access to its browser profile path. This prevented an automated visual inspection, not a build or application failure.

**Follow-up:** Open the local M04 scene in a desktop browser for a visual framing check before the next visual milestone. Continue with M05 only after confirming the district is fully visible at first load.

### Scope

- Reviewed the M04 presentation projection boundary, static 3D scene, responsive canvas, and camera configuration.
- Confirmed the renderer receives only `DistrictProjection` data and does not read the district catalog.
- Ran the required automated quality checks and requested production-only security audit.

### Findings

- The projection includes every catalog node, directed edge, and named area, while producing immutable display-ready values.
- The scene uses only geometric primitives, ambient and directional lighting, a bounded pixel ratio, and no textures, imported models, animation, or shadows.
- The local Vite server returned HTTP 200 for the M04 application. The browser bridge itself could not start under the sandbox restriction described above.

### Action

- No M02 or M03 public contracts were changed.
- Added the static baseline scene and focused projection and canvas-boundary tests.

### Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 15 tests passed.
- `npm run build` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.
- Local development server response — HTTP 200.

## Architecture Review After M04 Baseline District Projection and Scene

**Date:** 2026-07-25

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved with documentation follow-up

**Approved:** Yes

**Issues:** `DEPENDENCY_RULES.md` states that Presentation may depend only on its own code and Core, while `PROJECT_STRUCTURE.md` permits projection code to read public domain contracts. M04 uses the latter, narrowly: `projectDistrict` imports only public district types and `DistrictScene` consumes only `DistrictProjection`.

**Follow-up:** Resolve the documentation wording before a later architectural change. Retain the existing rule that renderers must consume projection data only.

### Scope

- Reviewed presentation imports, the district projection, the static scene, performance choices, and M05-scope leakage.
- Re-ran the M04 local verification suite.

### Findings

- The renderer has no district, simulation, routing, scenario, analytics, or insight import; it receives `DistrictProjection` only.
- `App` is the composition point that supplies the immutable catalog to `projectDistrict`; the scene never receives `centralDistrictDefinition`.
- The scene contains only a ground plane, roads, intersection markers, two landmark blocks, ambient and directional lighting, and orbit controls. It contains no texture, imported model, animation, or shadow work.
- The pixel ratio is capped at 1.5 and geometry is bounded to the small M03 graph. No M05 route selection, pathfinding, vehicle movement, closure behavior, congestion, analytics, or insight behavior was added.

### Action

- No source or package changes were required by this review.

### Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 15 tests passed.
- `npm run format:check` — passed.
- `npm run build` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Visual Review After M04 District Scene Refinement

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** The original M04 frame was too conservative, visually diagonal, lacked readable area context, and did not distinguish primary and alternative roads.

**Follow-up:** Proceed to M05 without adding visual traffic behavior before M09.

### Scope

- Reviewed the live local scene against camera framing, cardinal orientation, road hierarchy, labels, ground treatment, and M04 scope.

### Findings

- The full eight-node district now appears in one compact 4:3 frame with North Gate at the top, South Gate at the bottom, and East Hub at the right.
- Dark-blue primary roads and teal alternative streets provide immediate visual hierarchy.
- Every node has a readable label; both named-area landmarks have labels; the legend no longer covers district content.
- The scene remains lightweight: simple geometry, a grid helper, no textures, imported models, animation, shadows, vehicles, routing, simulation, congestion, analytics, or insight behavior.

### Action

- Refined only display coordinates and presentation projection/scene data. Graph topology, vehicle roster, simulation rules, and public M02/M03 contracts remain unchanged.

### Verification

- Local browser preview displayed the full district in one frame.
- Browser console error check returned no errors.

## Graph-Alignment Review After M04 District Scene Redefinition

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** The previous visual layout made the documented main corridor and alternative route less immediately comparable with `DISTRICT_GRAPH.md`.

**Follow-up:** Keep future traffic and closure visuals anchored to this graph-aligned layout.

### Scope

- Compared the eight node positions and all 16 rendered edge projections with the canonical directed-edge table in `DISTRICT_GRAPH.md`.

### Findings

- The north-up main corridor is visually ordered as `north-gate → civic-square → market → hospital → east-hub`.
- The documented alternative route is visually ordered as `civic-square → riverside → warehouse → east-hub`.
- South-gate, market-to-riverside, warehouse-to-hospital, and east-hub-to-hospital connections remain present; no edge IDs, directions, capacities, vehicle data, or scenario behavior changed.

### Action

- Changed only immutable display coordinates, ground/camera framing, and a projection-layout test. No public contract or simulation rule changed.

### Verification

- Projection test confirms all catalog nodes and edges are included and locks the north-up layout relationship.
- Local browser preview confirms the full graph-aligned district is visible with no console errors.

## Toolchain Review After M04 Presentation Updates

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Continue with the documented milestone sequence. Revisit bundle-size optimization only during the planned quality and performance pass if profiling warrants it.

### Scope

- Compared project dependencies, scripts, compiler settings, Vite configuration, ESLint configuration, Prettier configuration, and test setup with `TECH_STACK.md`.

### Findings

- Vite 7 is configured with the React plugin and source alias.
- React 19, TypeScript 5 with strict application settings, Three.js, React Three Fiber, Drei, and `@types/three` match the selected rendering stack.
- ESLint 9 with TypeScript and React rules, Prettier 3, and Vitest 3 with Testing Library and JSDOM match the documented quality stack.
- npm is the active package manager; no routing, state-management, enterprise, cloud, mapping, physics, or external AI dependency has been introduced.

### Action

- No dependency or configuration change was required.

### Verification

- `npm ls --depth=0` — installed top-level packages match the selected stack.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 16 tests passed.
- `npm run format:check` — passed.
- `npm run build` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Code Review After M04 Graph-Aligned Presentation

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Continue the milestone sequence. Keep the M04 rendering packages because they are now active runtime dependencies.

### Scope

- Searched project source, documentation, and configuration for typed `any` and unfinished-work markers.
- Reviewed the manifest and installed top-level packages for active scope justification.
- Compared the current directory tree with `PROJECT_STRUCTURE.md`.

### Findings

- No typed-escape pattern or unfinished-work marker exists outside generated dependency/build directories.
- React, React DOM, Three.js, React Three Fiber, and Drei are active M04 runtime dependencies.
- Type definitions, Vite, Vitest, Testing Library, JSDOM, ESLint, TypeScript ESLint, Prettier, and related configuration packages each support the active toolchain or tests.
- `src/presentation/projection` and `src/presentation/scene` are documented M04 responsibilities. The added `docs/BACKLOG.md` is a durable project-planning document allowed by the documentation structure.
- `.npm-cache`, `node_modules`, and `dist` are ignored local/generated directories. No undocumented source-domain folder was introduced.

### Action

- No dependency or source-structure change was required.

### Verification

- Repository-wide red-flag scans returned no matches.
- `npm ls --depth=0` confirmed the installed top-level dependency set.

## Milestone Verification Review After M04

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed with M05 deterministic route selection. Preserve the current graph as the normal-state and closure-routing verification baseline.

### Scope

- Reviewed M01–M04 deliverables against `MILESTONES.md`, the simulation specification, catalog data, validation logic, projection tests, and the district graph reference.
- Ran the requested local quality and production-only security checks.

### Findings

- M01 provides the documented Vite, React, TypeScript, ESLint, Prettier, Vitest, and Testing Library foundation.
- M02 provides strict immutable contracts, typed result/error values, application states, reducer actions, and valid-transition/reset/recovery tests.
- M03 defines one frozen fictional district with 8 nodes, 16 directed edges, exactly one closable edge (`e02`), 10 deterministic vehicles with spawn ticks from 0 through 27, two valid probes, and typed catalog validation failures.
- The normal North Gate-to-East Hub corridor is `e01 → e02 → e03 → e04` with a total configured length of 32. Removing the closable `e02` leaves the longer `e01 → e05 → e06 → e07` alternate route with a total configured length of 44.
- The emergency probe is `north-gate → hospital`; the delivery probe is `south-gate → east-hub`. They match `DISTRICT_GRAPH.md` and remain explicitly illustrative simulation proxies.
- M04 projects every catalog node, edge, and named area into immutable presentation data. The renderer receives the projection only and shows the graph-aligned north-up normal state without routing, vehicle movement, congestion, closure, analytics, or insight behavior.

### Action

- No implementation correction was required.

### Verification

- `npm run build` — passed.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 16 tests passed.
- `npm run format:check` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Documentation Synchronization After M04

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Updated

**Approved:** Yes

**Issues:** The README, roadmap, terminology, decision history, and documentation index still contained pre-M04 assumptions or incomplete references.

**Follow-up:** Keep documentation synchronized whenever a completed milestone changes delivered behavior, public architecture, or the dependency order.

### Scope

- Compared all authoritative project documents with the current M01–M04 implementation, planned M04 visual-polish backlog task, and `DISTRICT_GRAPH.md`.

### Findings

- The README did not yet describe the implemented toolchain, Central District catalog, projection boundary, or static baseline scene.
- The roadmap incorrectly described moving vehicles as part of the completed baseline visual phase.
- The M04 visual-polish task had conflicting timing, and two implementation records referred to the Mermaid graph as ASCII.
- Projection-only rendering was a material architectural decision not yet recorded as an ADR.

### Action

- Updated the README, roadmap, backlog timing, known-issues reference, changelog, implementation log, glossary, project-structure documentation index, and ADR history.
- No source, domain, simulation, dependency, or rendering behavior changed.

### Verification

- Documentation consistency scan found no remaining obsolete ASCII or pre-implementation status reference.
- `git diff --check` — passed.
- `npm run format:check` — passed.

## Review After M05 Deterministic Route Selection Implementation

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed to M06 only when implementing deterministic vehicle snapshots and lifecycle behavior.

### Scope

- Reviewed the pure shortest-path service, its public exports, dependency boundary, and deterministic tests against the routing rules.

### Findings

- The service depends only on public Core and District contracts, accepts immutable input data, and has no presentation, application, browser, timing, asynchronous, cache, or mutable singleton dependency.
- It uses Dijkstra's algorithm with closed-edge exclusion, supplied congestion-weighted costs, a default multiplier of one, and the required lexicographic edge-ID tie-break.
- The implementation returns a typed no-route outcome instead of throwing for an unreachable destination.
- Tests cover the baseline path, the documented closure alternate, equal-cost paths in reverse insertion order, disconnected graphs, blocked edges, congestion weighting, input immutability, and repeated-call determinism.

### Action

- Added the M05 routing service and focused unit tests. No M02/M03 contract, presentation, simulation lifecycle, scenario, analytics, or insight behavior changed.

### Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 24 tests passed.
- `npm run build` — passed.
- `npm run format:check` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Toolchain Review After M05 Route Selection

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Continue with M06 when ready; retain the current lightweight, local-first toolchain.

### Scope

- Compared the manifest, installed top-level packages, Vite configuration, TypeScript configuration, ESLint configuration, and Prettier configuration with `TECH_STACK.md`.

### Findings

- Vite 7 uses the React plugin and source alias; React 19 is the active frontend runtime.
- TypeScript 5 uses strict compiler options; ESLint 9 and Prettier 3 provide the documented quality tooling.
- Vitest 3 is configured through Vite with JSDOM and Testing Library support.
- The Three.js, React Three Fiber, Drei, and `@types/three` packages match the selected M04 rendering stack. No routing, state-management, enterprise, cloud, mapping, physics, or external AI package has been added.

### Action

- No package, lockfile, or configuration changes were required.

### Verification

- `npm ls --depth=0` — installed top-level packages match the selected stack.

## Code Review After M05 Route Selection

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** Historical review-log wording created false-positive source-quality scan results.

**Follow-up:** Proceed with M06. Continue recording deferred work in `KNOWN_ISSUES.md` rather than source comments.

### Scope

- Searched authored project files for typed escape usage and unfinished-work markers.
- Reviewed manifest dependencies against the active M01–M05 implementation scope.
- Compared the current source tree with `PROJECT_STRUCTURE.md`.

### Findings

- No typed escape usage or unfinished-work marker remains in authored project files.
- All manifest packages support the active Vite, React, TypeScript, test, lint, formatting, or M04 rendering stack. None is unnecessary for the completed M01–M05 scope.
- The current source folders are documented domain boundaries with implemented responsibilities; no unapproved technology bucket or empty future-only source directory exists.

### Action

- Rephrased one historical review-log sentence to prevent a documentation-only false positive in project-wide scans.

### Verification

- Repository-wide quality scans returned no matches.
- `git diff --check` — passed.

## Milestone Verification Review After M05

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed to M06 fixed-tick vehicle lifecycle. Defer bundle-size optimization to the planned M14 performance pass unless it affects observed demo performance.

### Scope

- Reviewed completed M01–M05 deliverables against `MILESTONES.md`, the simulation specification, implementation tests, and the canonical Central District graph.
- Ran the full local quality suite and production-only security audit.

### Findings

- M01 provides the documented Vite, React, TypeScript, ESLint, Prettier, Vitest, and Testing Library foundation.
- M02 supplies immutable domain contracts, typed result and application-error values, explicit reducer transitions, and reducer tests.
- M03 supplies the frozen Central District catalog with 8 nodes, 16 directed edges, one closable edge, 10 fixed-spawn vehicles, two probes, and typed graph validation.
- M04 projects immutable catalog data into a graph-aligned static scene; the renderer consumes projection data and has no routing or simulation behavior.
- M05 provides pure Dijkstra routing with blocked-edge exclusion, congestion-weighted costs, deterministic lexicographic tie-breaking, typed no-route outcomes, and focused unit coverage.
- The graph reference and catalog agree: the normal North Gate-to-East Hub route uses `e01 → e02 → e03 → e04` at cost 32; blocking `e02` selects `e01 → e05 → e06 → e07` at cost 44. The emergency and delivery probes match the canonical graph and remain illustrative simulation proxies.
- The production build emits Vite's generic large-chunk advisory for the active Three.js scene. This is not a current functional or security failure and is appropriately evaluated during M14 performance work.

### Action

- No implementation correction was required.

### Verification

- `npm run build` — passed.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 24 tests passed.
- `npm run format:check` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.

## Milestone Verification Review After M05

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved with follow-up

**Approved:** Yes

**Issues:** The production build emits Vite's standard bundle-size warning for the active 3D-rendering bundle. This does not prevent the build or current MVP behavior.

**Follow-up:** Reassess bundle size during M14 using measurement on the demonstration hardware; do not add premature code-splitting now.

### Scope

- Reviewed completed M01–M05 deliverables against their milestone checklists.
- Compared the canonical graph reference with the immutable Central District catalog, projection layout tests, and routing tests.
- Ran the full local quality suite and production-only dependency audit.

### Findings

- M01 provides the documented Vite, React, TypeScript, ESLint, Prettier, and Vitest foundation with a runnable build and test setup.
- M02 provides strict immutable contracts, explicit typed application states, and reducer coverage for normal, reset, and recoverable-error transitions.
- M03 provides a frozen Central District with 8 nodes, 16 directed edges, exactly one closable edge, 10 fixed-spawn vehicles, two probes, and typed catalog validation.
- M04 projects immutable catalog data into the static 3D scene, includes every node and edge, and keeps rendering isolated from the catalog during scene rendering.
- M05 provides pure Dijkstra route selection with blocked-edge filtering, congestion-weighted costs, lexicographic tie-breaking, typed no-route results, and deterministic tests.
- The graph reference matches the catalog: `e02` is the sole closable edge; the normal North Gate-to-East Hub route is `e01 → e02 → e03 → e04` with cost 32; blocking `e02` selects `e01 → e05 → e06 → e07` with cost 44. The emergency and delivery probes also match the graph reference.

### Action

- No implementation correction was required.

### Verification

- `npm run build` — passed.
- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 24 tests passed.
- `npm run format:check` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.

## M01–M06 Completion Review

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Needs revision

**Approved:** No

**Issues:** M06 creates immutable snapshots and covers the required lifecycle transitions, but its per-vehicle advancement does not model the globally staged tick sequence required by the simulation specification. It calculates occupancy only after state transitions and replans completed-edge arrivals in the same advance.

**Follow-up:** Correct M06 tick staging before M07. In particular, retain previous-snapshot occupancy for the M07 multiplier calculation and make node-arrival replanning agree with the documented tick boundary.

### Scope

- Reviewed M01–M06 against their milestone deliverables, implementation records, simulation specification, and source boundaries.
- Ran the full local quality suite and production-only dependency audit.

### Findings

- M01 toolchain, M02 contracts, M03 district catalog, M04 static scene, and M05 route selection are complete within their documented boundaries.
- M06 provides a pure snapshot factory, fixed tick duration, scheduled spawning, movement, waiting, retry, respawn, immutable output, deterministic vehicle-ID ordering, and lifecycle tests.
- The M06 engine processes each vehicle independently rather than staging the whole tick. This means it does not preserve pre-movement occupancy for the next milestone and performs node-arrival route planning before the next tick's planning phase.
- No M07 congestion formula, closure execution, analytics, or presentation behavior has been introduced.

### Risks for M07

- M07 requires occupancy from the previous snapshot before movement. Add a clear pre-movement occupancy phase rather than deriving it only from the already-advanced vehicle states.
- Define and test one unambiguous tick-boundary convention for spawn, retry, arrival, and respawn so the congestion multiplier applies to the correct movement tick.
- Keep the same congestion multiplier available to both movement and route planning without coupling simulation to rendering or application state.

### Deferred Work

- M07 congestion and route-cost rules.
- M08 road-closure execution, scenario application, rerouting, and reset.
- M09–M15 presentation, analytics, insights, controls, quality pass, and submission preparation.

### Verification

- `npm run typecheck` — passed.
- `npm run lint` — passed.
- `npm run test` — 34 tests passed.
- `npm run build` — passed.
- `npm run format:check` — passed.
- `npm audit --omit=dev` — 0 vulnerabilities.

## M06 Tick-Processing Correction Review

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** The earlier M06 review identified an unstaged tick model. The correction is complete.

**Follow-up:** Proceed to M07 congestion rules using the retained previous-snapshot occupancy phase.

### Scope

- Reviewed the M06 engine correction for the global scenario, occupancy, multiplier, planning, movement, arrival, waiting, and publication sequence.

### Findings

- Scenario events remain an explicit no-op in M06; no closure or scenario behavior was added.
- Occupancy is calculated from the input snapshot before planning and movement. M06 passes flat multipliers of one to routing and movement; M07 owns the non-flat calculation.
- Spawned and retried vehicles plan before movement and move once in the same logical tick.
- Completed-edge arrivals publish a zero-duration `node-arrival` waiting state, so route selection occurs only in the following tick's planning phase.
- Every published snapshot is deeply immutable at its owned boundary, vehicle processing is identifier-sorted, and no wall-clock, random, asynchronous, presentation, analytics, or congestion behavior was introduced.

### Action

- Reworked M06 into global tick phases and added the minimal waiting-reason extension needed to retain node arrivals across the tick boundary.

### Verification

- Typecheck, lint, and all 34 tests passed before final build and audit verification.

## M01–M06 Completion Verification After M06 Correction

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved with follow-up

**Approved:** Yes

**Issues:** The identical private `compareText` helper appears in the routing service and two simulation-engine files. This is a small maintainability issue, not a milestone-boundary or functional defect.

**Follow-up:** Proceed to M07 only. Extract the dependency-free comparator into Core as a narrowly scoped cleanup when it is next touched; preserve M06's global staged tick model.

### Scope

- Verified M01 through M06 against their deliverables and definitions of done in `MILESTONES.md`.
- Checked that completed implementation remains within each milestone boundary after the M06 tick-processing correction.
- Reviewed the documented deferred work and M07 integration risks.

### Findings

- M01 provides the documented Vite, React, TypeScript, ESLint, Prettier, Vitest, Testing Library, strict typing, and source-alias foundation.
- M02 provides immutable domain contracts, typed results and recoverable errors, explicit application state transitions, and reducer tests.
- M03 provides the validated immutable Central District catalog, including 8 nodes, 16 directed edges, one closable edge, deterministic vehicles, and the two required probes.
- M04 provides a projection-isolated, static 3D district scene without routing, lifecycle, scenario, analytics, or insight behavior.
- M05 provides pure deterministic Dijkstra routing with weighted costs, blocked-edge support, lexicographic tie-breaking, typed no-route results, and focused tests.
- M06 provides the immutable snapshot factory and fixed-tick lifecycle. Its global phases retain previous-snapshot occupancy, use flat M06 multipliers, plan before movement, defer completed-edge replanning to the next tick, and preserve stable vehicle-ID ordering.
- No M07 congestion formula, M08 scenario execution or closures, M09 traffic rendering, analytics, insights, controls, or reset behavior has entered the implemented M01–M06 scope.

### Risks for M07

- Replace only the current flat multiplier placeholder with the specified previous-occupancy, capacity-based multiplier, capped at three; use the same multiplier for route cost and movement in a tick.
- Retain the global phase boundary: occupancy must remain derived from the prior snapshot, and no vehicle may observe another vehicle's same-tick state change.
- Add explicit tests for free-flow, busy, congested, and capped multiplier behavior without adding road-closure behavior early.
- The existing production build has a non-blocking Three.js bundle-size advisory. Measure it on demonstration hardware during M14 before introducing code-splitting.

### Deferred Work

- M07 congestion and route-cost rules.
- M08 road-closure scenario execution, rerouting, and reset.
- M09–M15 dynamic traffic presentation, analytics, deterministic insights, guided controls, hardening, and submission work.
- M04 visual polish, the deferred development-toolchain advisory, and runtime AI integration, as recorded in `KNOWN_ISSUES.md`.

### Action

- No implementation change was made. This review entry records the verified completion state and the narrow M07 follow-up risks.

### Verification

- The current local verification suite remains green: typecheck, lint, 34 tests, production build, and formatting check.
- `git diff --check` — passed before this documentation-only entry.

## Code-Quality Review After M06 Comparator Consolidation

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None. The previously recorded duplicate comparator implementation is resolved.

**Follow-up:** Proceed to M07 only; preserve the staged M06 tick model.

### Scope

- Reviewed the extraction of the repeated deterministic text-comparison implementation into one dependency-free Core utility.

### Findings

- Routing and M06 simulation code share exactly one comparator implementation.
- The comparison semantics and all existing simulation and routing behavior remain unchanged.
- No simulation contracts, lifecycle logic, dependencies, or M07 behavior changed.

### Action

- Removed the three duplicate private helpers and imported the shared Core utility.

### Verification

- Typecheck, lint, tests, production build, and formatting check passed.

## M01–M06 Completion Verification After Comparator Consolidation

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Needs revision

**Approved:** No

**Issues:** M01–M06 functional deliverables are complete, but three cross-domain imports bypass Core's public `index.ts` entry point. `shortest-path.ts`, `advance-simulation.ts`, and `create-initial-simulation-snapshot.ts` import `@/core/compare-text` directly, contrary to `PROJECT_STRUCTURE.md` and `DEPENDENCY_RULES.md`.

**Follow-up:** Before M07, re-export `compareText` through `@/core` and update the three imports. Do not alter comparator behavior or simulation APIs.

### Scope

- Verified the documented M01–M06 toolchain, contracts, district, scene, routing, and lifecycle deliverables.
- Checked milestone boundaries, deferred work, and the current import-boundary compliance issue.

### Findings

- M01 through M06 satisfy their functional deliverables: the toolchain, immutable contracts, validated Central District, static projection scene, deterministic routing, and staged fixed-tick lifecycle are implemented.
- No M07 congestion formula, M08 closure/reset behavior, M09 traffic rendering, analytics, insights, or interactive scenario controls are present.
- The comparator cleanup removed duplicate logic, but its direct Core-file imports violate the project's public-module import convention. This is an architecture hygiene defect, not a lifecycle or routing defect.

### Risks for M07

- Correct the Core import boundary before adding congestion behavior so M07 builds on the documented dependency model.
- Derive occupancy from the previous snapshot, calculate capacity-based multipliers capped at three, and use the same multiplier for route cost and movement.
- Preserve M06's global staged tick boundary and add tests for zero, busy, congested, and capped occupancy cases.

### Deferred Work

- M07 congestion and route-cost rules; M08 scenario execution, rerouting, and reset; M09–M15 dynamic presentation, analytics, insights, controls, quality, and submission work.
- M04 visual polish, the deferred development-toolchain advisory, and runtime AI integration remain tracked in `KNOWN_ISSUES.md`.

### Action

- No implementation change was made in this review; the import-boundary correction remains required.

### Verification

- Typecheck, lint, 34 tests, production build, and formatting check passed in the preceding repository review.
- `git diff --check` — passed before this review entry.

## Architecture Review After Core Import-Boundary Repair

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None. The previously reported Core deep-import violation is resolved.

**Follow-up:** Proceed to M07 only; preserve the staged M06 tick model.

### Scope

- Reviewed the Core public export and all routing and simulation imports of the shared deterministic comparator.

### Findings

- `compareText` is exported through `@/core`.
- Routing and simulation import Core only through its documented public entry point.
- Comparator behavior, simulation APIs, lifecycle logic, and tests are unchanged.

### Action

- Repaired the documented import boundary without adding M07 behavior.

### Verification

- Typecheck, lint, tests, production build, formatting check, and the production-only dependency audit passed.

## Final M01–M06 Completion Verification

**Date:** 2026-07-26

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** None.

**Follow-up:** Proceed to M07 congestion and route-cost rules only.

### Scope

- Verified the completed M01 through M06 deliverables, module boundaries, deferred work, and the M07 handoff risks.

### Findings

- M01 toolchain: Vite, React, TypeScript, linting, formatting, and tests are configured and verified.
- M02 contracts: immutable domain contracts, typed results, and application-state reducer transitions are implemented and tested.
- M03 district catalog: the validated immutable Central District contains the documented graph, vehicle roster, closable edge, and probes.
- M04 scene: the static district scene consumes projection data and does not implement simulation behavior.
- M05 routing: deterministic, typed Dijkstra route selection remains isolated from presentation.
- M06 vehicle lifecycle: the staged fixed-tick engine publishes immutable, deterministic snapshots without congestion, closure, analytics, rendering, or interface behavior.
- M01–M06 boundaries remain intact. The Core comparator is consumed through Core's public entry point, resolving the prior import-boundary finding.

### Risks for M07

- Derive congestion from previous-snapshot occupancy, using the capacity-based multiplier capped at three.
- Apply the same multiplier to route cost and movement for a tick while preserving M06's global staged tick order.
- Add deterministic tests for free-flow, busy, congested, and capped conditions without introducing M08 closure behavior.

### Deferred Work

- M07 congestion and route-cost rules; M08 scenario execution, rerouting, and reset; M09–M15 dynamic presentation, analytics, insights, controls, quality, and submission work.
- M04 visual polish, the deferred development-toolchain advisory, and runtime AI integration remain tracked in `KNOWN_ISSUES.md`.

### Action

- No implementation change was required.

### Verification

- Typecheck, lint, 34 tests, production build, formatting check, and `npm audit --omit=dev` passed in the latest repository verification.

## M07 Congestion Tick-Calculation Repair Review

**Date:** 2026-07-29

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** The prior implementation derived edge traffic twice in one tick. The repair now reuses the sole pre-movement result for routing, movement, and snapshot publication.

**Follow-up:** Proceed to the M07 verification review; M08 remains deferred.

### Scope

- Reviewed the focused M07 correction for single-calculation congestion timing.

### Findings

- `advanceSimulation` derives traffic only from the previous snapshot before planning and movement.
- The same immutable traffic data is used for routing, effective speed, and the published snapshot.
- No closure, scenario execution, rendering, analytics, or insight behavior was added.

### Action

- Removed the post-movement traffic derivation and added a regression test for published pre-movement traffic.

### Verification

- Typecheck, lint, tests, production build, formatting check, and the production-only dependency audit are run with this repair.

## M07 Snapshot Occupancy Timing Repair Review

**Date:** 2026-07-29

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** The prior snapshot combined post-movement vehicles with pre-movement occupancy. The repair now derives post-movement occupancy without recalculating traffic conditions.

**Follow-up:** Proceed to the final M07 verification review; M08 remains deferred.

### Scope

- Reviewed the focused M07 repair for snapshot occupancy consistency.

### Findings

- Congestion and classifications remain calculated exactly once from pre-movement occupancy.
- Routing and movement continue to use that single pre-movement traffic result.
- Snapshot occupancy is calculated separately from post-movement vehicles without deriving multipliers or classifications.
- No M08 behavior was added.

### Action

- Added an occupancy-only derivation and updated the regression coverage for a completed edge.

### Verification

- Typecheck, lint, tests, production build, formatting check, and the production-only dependency audit are run with this repair.

## M07 Traffic Derivation Efficiency Repair Review

**Date:** 2026-07-29

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved

**Approved:** Yes

**Issues:** The traffic derivation sorted district edges twice. The repair reuses one ordered collection for its occupancy and traffic work.

**Follow-up:** Proceed to the final M07 verification review; M08 remains deferred.

### Scope

- Reviewed the focused M07 removal of duplicate edge sorting.

### Findings

- Pre-movement traffic derivation sorts district edges once.
- Post-movement occupancy derivation retains its own single deterministic sort.
- Congestion calculations, route selection, movement, snapshots, and public APIs are unchanged.

### Action

- Passed the ordered edge collection to a private occupancy helper.

### Verification

- Typecheck, lint, tests, production build, formatting check, and the production-only dependency audit are run with this repair.

## Future Review Entry Template

Copy this structure for every future review:

```markdown
## [Review Type] After M[NN] [Milestone Title]

**Date:** YYYY-MM-DD

**Reviewed by:** Codex GPT-5.6

**Outcome:** Approved | Approved with follow-up | Needs revision

**Approved:** Yes | No

**Issues:** [None or concise description.]

**Follow-up:** [Next action or milestone.]

### Scope

- [What was reviewed.]

### Findings

- [Finding or "No issues found."]

### Action

- [Correction made or "No changes required."]

### Verification

- [Commands run and result.]
```
