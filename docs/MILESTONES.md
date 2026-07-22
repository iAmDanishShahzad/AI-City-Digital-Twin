# AI City Digital Twin: Implementation Milestones

## How to Use This Plan

Each milestone is one focused implementation session, expected to take 30-90 minutes. Complete milestones in ID order. A milestone may be split if it cannot reach its verification checklist in one session; do not combine it with unrelated work to recover time.

The required MVP path is the deterministic road-closure demo. Additional scenario types remain out of scope. Every milestone must leave the repository in a runnable, testable state.

## Dependency Flow

```text
M01 -> M02 -> M03 -> M04 -> M05 -> M06 -> M07 -> M08 -> M09 -> M10 -> M11 -> M12 -> M13 -> M14 -> M15
```

## M01 - Project Toolchain

- **Milestone ID:** M01
- **Title:** Initialize the runnable project foundation
- **Goal:** Create the selected local development, build, linting, formatting, and test environment.
- **Deliverables:** Project manifest and scripts; strict compiler configuration; linting and formatting configuration; test runner setup; source alias; minimal application entry point.
- **Dependencies:** None; approved project documentation.
- **Estimated duration:** 60-90 minutes.
- **Verification checklist:**
  - Development server starts.
  - Production build completes.
  - Type checking, linting, formatting check, and an initial test run pass.
  - No domain behavior is placed in configuration or entry files.
- **Expected Git commit message:** `chore: initialize MVP toolchain`
- **Definition of Done:** A clean checkout can run the quality commands and display a minimal application shell.

## M02 - Domain Contracts and Application State

- **Milestone ID:** M02
- **Title:** Define core contracts and explicit application state
- **Goal:** Establish typed, dependency-safe contracts for the architecture before adding behavior.
- **Deliverables:** Immutable contracts for district, scenario, simulation snapshot, analytics summary, insight, result/error states, and application state; reducer actions for initialize, scenario selection, update, reset, and recoverable error.
- **Dependencies:** M01.
- **Estimated duration:** 75-90 minutes.
- **Verification checklist:**
  - Contracts compile under strict typing.
  - Reducer tests cover valid transitions and recoverable error/reset transitions.
  - Domain modules remain independent of presentation and application composition.
  - No `any`, mutable singleton state, or circular import is introduced.
- **Expected Git commit message:** `feat: define simulation domain contracts`
- **Definition of Done:** Application state can be reduced through the documented states using typed actions and deterministic tests.

## M03 - District Catalog and Graph Validation

- **Milestone ID:** M03
- **Title:** Build the fixed district definition
- **Goal:** Implement the immutable MVP district catalog required by the simulation specification.
- **Deliverables:** One fictional district with 8-12 nodes, 12-20 directed edges, one closable edge, baseline vehicle roster, named areas, and two route probes; catalog validation.
- **Dependencies:** M02.
- **Estimated duration:** 60-90 minutes.
- **Verification checklist:**
  - The catalog rejects duplicate IDs, invalid endpoints, non-positive edge values, and a missing alternate route.
  - The configured closure lies on a preferred baseline route with an alternate path.
  - Vehicle count and spawn ticks comply with the specification.
  - Catalog tests use only deterministic fixture data.
- **Expected Git commit message:** `feat: add deterministic district catalog`
- **Definition of Done:** A validated district definition can be loaded without rendering and is sufficient to support the required closure demonstration.

## M04 - Baseline District Projection and Scene

- **Milestone ID:** M04
- **Title:** Render the normal-state district
- **Goal:** Produce a visually coherent, static normal-state view from the immutable district catalog.
- **Deliverables:** District-to-presentation projection; roads, simple blocks or landmarks, camera framing, basic lighting, and named-area context in the scene.
- **Dependencies:** M03.
- **Estimated duration:** 75-90 minutes.
- **Verification checklist:**
  - The main corridor and an alternate route are visible at first view.
  - The scene renders from presentation projection data, not direct catalog mutation.
  - A projection test validates road and area output.
  - Manual scene check confirms readable framing with no runtime errors.
- **Expected Git commit message:** `feat: render baseline district scene`
- **Definition of Done:** The application displays a stable, understandable fictional district before traffic behavior is added.

## M05 - Deterministic Route Selection

- **Milestone ID:** M05
- **Title:** Implement weighted shortest-path routing
- **Goal:** Provide the pure routing operation that all vehicles and probes use.
- **Deliverables:** Allowed-edge filtering, weighted shortest-path calculation, lexicographic edge-ID tie breaking, and explicit no-route result.
- **Dependencies:** M03.
- **Estimated duration:** 60-75 minutes.
- **Verification checklist:**
  - The preferred normal route uses the configured closable edge.
  - Closing that edge selects the configured alternate route.
  - Equal-cost paths use the required lexicographic tie break.
  - Disconnected origins return a typed no-route result.
- **Expected Git commit message:** `feat: add deterministic route selection`
- **Definition of Done:** Routing is a pure, independently tested domain operation with no presentation dependency.

## M06 - Fixed-Tick Vehicle Lifecycle

- **Milestone ID:** M06
- **Title:** Advance deterministic vehicle snapshots
- **Goal:** Implement scheduled spawning, movement, arrival, waiting, retry, and respawn behavior using fixed logical ticks.
- **Deliverables:** Snapshot factory; fixed 0.1-second tick advancement; vehicle lifecycle transitions; immutable occupancy calculation; stable vehicle processing order.
- **Dependencies:** M02, M03, M05.
- **Estimated duration:** 75-90 minutes.
- **Verification checklist:**
  - Vehicles spawn only on their configured tick.
  - Movement uses the configured base speed and edge progress remains in the inclusive 0-1 range.
  - Destination arrival waits 20 ticks before respawn; no-route waiting retries after 10 ticks.
  - Replaying the same initial state and ticks produces identical snapshots.
- **Expected Git commit message:** `feat: implement fixed tick vehicle lifecycle`
- **Definition of Done:** A test can advance the simulation without rendering and verify all normal lifecycle transitions.

## M07 - Congestion and Route-Cost Rules

- **Milestone ID:** M07
- **Title:** Apply deterministic edge congestion
- **Goal:** Add the specified occupancy-derived slowdown and route-cost behavior.
- **Deliverables:** Pre-movement occupancy calculation; congestion multiplier capped at 3; effective-speed calculation; edge display classifications.
- **Dependencies:** M06.
- **Estimated duration:** 45-60 minutes.
- **Verification checklist:**
  - Occupancy is taken from the previous snapshot before movement.
  - Speed and route cost use the same multiplier for the tick.
  - Free-flowing, busy, and congested thresholds match the specification.
  - Tests cover zero occupancy, capacity occupancy, and capped congestion.
- **Expected Git commit message:** `feat: apply edge congestion rules`
- **Definition of Done:** The simulation exposes repeatable congestion data and visibly slower calculated movement at higher occupancy.

## M08 - Road-Closure Scenario and Reset

- **Milestone ID:** M08
- **Title:** Apply the deterministic road closure
- **Goal:** Implement the required MVP scenario effect, re-routing, and exact reset behavior.
- **Deliverables:** Scenario validation and catalog; next-tick closure event; closed-edge exclusion; affected-route discard and replanning; idempotent active selection; fresh reset state.
- **Dependencies:** M05, M06, M07.
- **Estimated duration:** 75-90 minutes.
- **Verification checklist:**
  - Selecting the closure schedules exactly one event for the next tick.
  - No vehicle enters a closed edge; a vehicle already on it completes the edge.
  - Affected vehicles replan at their next node; no-route vehicles wait and retry.
  - Re-selecting the active closure is a no-op.
  - Reset reproduces the fresh baseline state and clears scenario state.
- **Expected Git commit message:** `feat: add road closure scenario`
- **Definition of Done:** The core domain can deterministically demonstrate closure, rerouting or waiting, and reset without an interface.

## M09 - Simulated Traffic in the Scene

- **Milestone ID:** M09
- **Title:** Connect snapshots to visible traffic
- **Goal:** Render simulation vehicle positions, congestion, and closure markers from presentation projection data.
- **Deliverables:** Simulation-to-presentation projection; vehicle visual layer; dynamic congestion indicators; closure marker; fixed-tick driver isolated from the rendering loop.
- **Dependencies:** M04, M08.
- **Estimated duration:** 75-90 minutes.
- **Verification checklist:**
  - Visible vehicles follow current snapshot positions.
  - Applying a closure changes traffic visuals without mutating domain data in the scene.
  - A closure marker appears on the configured edge.
  - Reset restores normal visual state.
  - Manual scene check confirms that the reroute or congestion is understandable.
- **Expected Git commit message:** `feat: visualize simulated traffic changes`
- **Definition of Done:** The required normal -> closure -> visible traffic consequence loop works in the running application.

## M10 - Baseline Comparison and Traffic Analytics

- **Milestone ID:** M10
- **Title:** Derive traffic impact metrics
- **Goal:** Compare same-tick normal and scenario snapshots to produce validated traffic facts.
- **Deliverables:** Parallel baseline advancement; rerouted-vehicle count; no-route waiting count; congested-edge count; traffic-impact category; affected-edge calculation.
- **Dependencies:** M08.
- **Estimated duration:** 60-75 minutes.
- **Verification checklist:**
  - Baseline and scenario snapshots are compared at the same tick number.
  - Metrics do not mutate either simulation snapshot.
  - Low, moderate, and high traffic-impact thresholds match the specification.
  - Affected-edge IDs are stable and sorted.
- **Expected Git commit message:** `feat: derive scenario traffic impact`
- **Definition of Done:** The analytics module returns a typed, tested traffic summary for a closure snapshot.

## M11 - Access-Probe Analytics

- **Milestone ID:** M11
- **Title:** Derive emergency and delivery proxy impacts
- **Goal:** Calculate the two defined route-access proxies without introducing real-world operational claims.
- **Deliverables:** Emergency-access and delivery-access probe evaluation; unchanged, delayed, and unavailable classifications; explicit proxy metadata for presentation.
- **Dependencies:** M05, M10.
- **Estimated duration:** 45-60 minutes.
- **Verification checklist:**
  - Both probes use the same current graph and route costs as vehicles.
  - A 25% scenario-cost increase is classified as delayed.
  - Missing paths are classified as unavailable.
  - Output identifies these results as simulation proxies.
- **Expected Git commit message:** `feat: add access proxy analytics`
- **Definition of Done:** Analytics exposes deterministic emergency and delivery route-access proxies with complete unit coverage.

## M12 - Deterministic Insight Engine

- **Milestone ID:** M12
- **Title:** Generate validated scenario insights
- **Goal:** Convert validated analytics into the exact, deterministic MVP explanation format.
- **Deliverables:** Fixed insight templates; ordered statement composition; mandatory simulation disclaimer; safe validation-failure message.
- **Dependencies:** M10, M11.
- **Estimated duration:** 45-60 minutes.
- **Verification checklist:**
  - Every traffic-impact and probe result maps to the specified statement.
  - Output contains scenario, traffic, emergency, delivery, and disclaimer statements in order.
  - No random or external input affects insight text.
  - Invalid analytics input produces only the safe fallback message.
- **Expected Git commit message:** `feat: add deterministic scenario insights`
- **Definition of Done:** A tested insight module produces only simulation-grounded text from validated analytics.

## M13 - Guided Scenario Controls and Impact Panel

- **Milestone ID:** M13
- **Title:** Complete the interactive demo flow
- **Goal:** Expose the completed scenario behavior through a clear single-screen interface.
- **Deliverables:** Road-closure control; reset control; application orchestration; impact panel; visible error/recovery state; synchronized scene and interface projections.
- **Dependencies:** M09, M12.
- **Estimated duration:** 75-90 minutes.
- **Verification checklist:**
  - A user can select the road closure, observe the changed scene, read the insight, and reset.
  - Controls expose no unfinished or unsupported scenario.
  - Interface components send intent upward and do not calculate routing, simulation, or analytics.
  - User-facing tests cover select, impact display, error recovery, and reset.
- **Expected Git commit message:** `feat: add guided road closure demo`
- **Definition of Done:** The complete MVP story works from a fresh load without developer-only controls or manual state changes.

## M14 - Quality, Performance, and Resilience Pass

- **Milestone ID:** M14
- **Title:** Harden the demo flow
- **Goal:** Verify the completed MVP is responsive, recoverable, and stable on the demonstration machine.
- **Deliverables:** Targeted profiling improvements; optimized or bounded scene assets; error/reset/no-route/insight-fallback checks; final automated quality pass; manual visual verification checklist.
- **Dependencies:** M13.
- **Estimated duration:** 75-90 minutes.
- **Verification checklist:**
  - Initial load is under 5 seconds and scenario response is under 2 seconds on the target machine.
  - The scene aims for approximately 60 FPS with no obvious interaction stalls.
  - Repeated closure-and-reset cycles produce no runtime errors.
  - Tests, linting, formatting, type checking, and production build pass.
  - Camera framing, closure visibility, reroute visibility, and panel readability are manually verified.
- **Expected Git commit message:** `perf: harden road closure demo`
- **Definition of Done:** The core demo is stable, deterministic, and presentation-ready without expanding MVP scope.

## M15 - Submission Package and Rehearsal

- **Milestone ID:** M15
- **Title:** Prepare the hackathon submission
- **Goal:** Deliver a shareable build and a reliable 3-5 minute presentation path.
- **Deliverables:** Static deployment configuration and verified published or local fallback build; updated README and relevant docs; final demo script; known-limitations list.
- **Dependencies:** M14.
- **Estimated duration:** 60-90 minutes.
- **Verification checklist:**
  - The production build runs from the intended presentation environment.
  - A local fallback is verified if static publishing is unavailable.
  - The full normal-state -> closure -> impact -> insight -> reset walkthrough completes from a fresh start.
  - The presentation accurately labels all results as simulated proxies, not real-world predictions.
  - Repository status, docs, and build outputs are ready for submission.
- **Expected Git commit message:** `chore: prepare hackathon submission`
- **Definition of Done:** The project is ready to submit: reproducible, shareable, documented, and demonstrable within 3-5 minutes.
