# AI City Digital Twin: Development Roadmap

## Roadmap Purpose

This roadmap turns the MVP into a dependency-ordered, one-week engineering plan. The goal is a reliable 3-5 minute demo of one fictional district: apply a disruption, observe deterministic traffic changes, and receive a clear, simulation-grounded explanation.

Each phase is a gate. Do not expand scope or begin the next phase's non-essential work until the current phase meets its exit criteria. If time becomes constrained, protect the core road-closure flow and reduce visual detail or optional scenarios before compromising reliability.

## Phase Overview

| Phase | Focus | Suggested timing | Depends on |
| --- | --- | --- | --- |
| 1 | Project foundation and domain contracts | Day 1 | Approved documentation |
| 2 | Baseline district and visual foundation | Days 1-2 | Phase 1 |
| 3 | Deterministic traffic and scenario engine | Days 2-3 | Phase 2 |
| 4 | Impact analytics and dependable insights | Day 4 | Phase 3 |
| 5 | Guided interactive demo experience | Day 5 | Phase 4 |
| 6 | Performance, resilience, and demo hardening | Day 6 | Phase 5 |
| 7 | Release preparation and presentation rehearsal | Day 7 | Phase 6 |

## Phase 1: Project Foundation and Domain Contracts

**Goal:** Establish a clean, runnable project foundation and the small set of typed, deterministic contracts needed by later phases.

**Deliverables:**

- Project setup using the selected build, language, linting, formatting, and testing tools.
- Strict compiler, linting, formatting, test, and production-build scripts.
- The domain-first source layout defined in `PROJECT_STRUCTURE.md`.
- Public contracts for district definitions, scenarios and effects, simulation snapshots, analytics summaries, insights, and application states.
- A minimal application composition root with explicit state transitions and a recoverable error state.
- Shared deterministic test factories and test setup.

**Dependencies:**

- Approved product vision, system architecture, technology stack, project structure, and coding standards.

**Risks:**

- Spending too long on configuration or directory scaffolding.
- Defining abstractions before the first district and scenario make their needs concrete.
- Allowing presentation concerns into the domain contracts.

**Exit Criteria:**

- The application starts locally and produces a clean production build.
- Linting, formatting checks, type checking, and an initial test run pass.
- Public domain contracts are minimal, typed, and follow the documented dependency direction.
- No scenario, simulation, or rendering behavior is implemented outside its responsible module.

## Phase 2: Baseline District and Visual Foundation

**Goal:** Create a visually coherent normal-state district that establishes the demo's geography and supports future simulation updates.

**Deliverables:**

- One compact fictional district catalog with a small weighted road graph, named areas, and baseline vehicle definitions.
- A clear 3D scene containing roads, simple landmarks or blocks, vehicles, camera framing, and basic lighting.
- A presentation projection that maps immutable district data and baseline vehicle state into render-ready data.
- A normal-state view that is understandable at a glance and contains visible, continuous vehicle movement.
- Tests for district catalog validity and presentation projection of baseline state.

**Dependencies:**

- Phase 1 contracts, source layout, and application composition root.

**Risks:**

- Excessive scene detail harming performance or consuming time needed for the simulation.
- Unclear road layout making reroutes difficult to see.
- Coupling rendering objects directly to mutable simulation internals.

**Exit Criteria:**

- A viewer can identify the main route and at least one alternate route within 30 seconds.
- Vehicles move predictably through the normal-state scene.
- Static district rendering is separated from dynamic vehicle updates.
- The normal view runs smoothly on the demonstration machine and remains within the project's initial-load target.

## Phase 3: Deterministic Traffic and Scenario Engine

**Goal:** Deliver the core behavior: a supported disruption changes route availability and produces visible, repeatable traffic consequences.

**Deliverables:**

- A deterministic simulation engine that advances vehicle snapshots in bounded time steps.
- A small, weighted shortest-path implementation over the district road graph.
- Scenario validation, catalog, and effect translation.
- One complete road-closure scenario, including a visibly closed segment and affected route availability.
- Rerouting or congestion behavior that is clearly visible after the closure.
- Reset behavior that restores the exact normal-state baseline.
- Tests for scenario validation, path selection, route unavailability, simulation steps, and reset behavior.

**Dependencies:**

- Phase 2 district catalog, baseline scene, and presentation projection.

**Risks:**

- Over-modeling traffic instead of producing a clear, believable visual result.
- Route rules that create invalid or confusing vehicle behavior.
- Non-deterministic timers or mutable state causing the demo to differ between runs.

**Exit Criteria:**

- Selecting the road closure produces a consistent visible traffic change within the scenario-transition target.
- Vehicles never use an unavailable road segment and recover a valid route when one exists.
- Reset returns the scene and simulation state to the same baseline every time.
- Core domain tests pass without rendering the full scene.

## Phase 4: Impact Analytics and Dependable Insights

**Goal:** Convert the simulation result into short, truthful, user-understandable impact information.

**Deliverables:**

- Analytics rules that compare baseline and scenario snapshots.
- A typed impact summary covering traffic flow, affected routes, and high-level emergency-access and delivery implications.
- Stable thresholds that convert simulation facts into explainable categories.
- Deterministic, scenario-specific fallback insight text.
- Insight validation that prevents unsupported claims and clearly frames results as simulated outcomes.
- Tests for analytics rules, thresholds, fallback content, and invalid insight handling.

**Dependencies:**

- Phase 3 scenario context and deterministic simulation snapshots.

**Risks:**

- Insights claiming more certainty than the simulation supports.
- Mismatched analytics and visible behavior.
- Optional insight generation distracting from the reliable fallback path.

**Exit Criteria:**

- Every supported scenario produces an impact summary and a valid fallback insight without external services.
- Insight text matches the selected scenario and known simulation facts.
- The impact summary is concise enough to understand during the live demo.
- Simulation and analytics remain separable and independently testable.

## Phase 5: Guided Interactive Demo Experience

**Goal:** Connect the validated domain behavior to a simple, presentation-ready user flow.

**Deliverables:**

- Scenario controls that expose only completed and supported actions.
- Clear visual marking of the selected disruption and affected area.
- An impact panel that presents the scenario, traffic impact, and insight alongside the scene.
- A reset control and concise recoverable error state.
- Presentation projection updates that keep interface and 3D scene synchronized.
- User-focused tests for selecting a scenario, reading its result, and resetting the district.

**Dependencies:**

- Phase 4 analytics and insight contracts, plus Phase 3 stable simulation behavior.

**Risks:**

- Adding controls or panels that obscure the primary visual story.
- Leaking domain calculations into interface components.
- A confusing interaction sequence that makes the demo harder to explain.

**Exit Criteria:**

- A first-time viewer can complete the normal state -> road closure -> visible impact -> insight -> reset flow without instruction beyond the interface labels.
- The interface remains focused on one primary screen and one clear scenario flow.
- User actions produce explicit application-state transitions and recover gracefully from invalid actions.
- The core demonstration is complete without relying on optional features.

## Phase 6: Performance, Resilience, and Demo Hardening

**Goal:** Make the completed core flow stable, responsive, and dependable on demonstration hardware.

**Deliverables:**

- Profiling and targeted optimization of initial load, scenario transition, and scene updates.
- Reduced or optimized assets and a bounded vehicle count where needed.
- Validation of error, reset, unavailable-route, and insight-fallback paths.
- A clean production build and a static deployment configuration.
- Final pass on linting, formatting, type checking, tests, and documentation accuracy.

**Dependencies:**

- Phase 5 complete interactive flow.

**Risks:**

- Late visual changes breaking deterministic behavior.
- Premature micro-optimizations obscuring otherwise correct code.
- Treating a clean build as proof of a reliable visual demo.

**Exit Criteria:**

- Initial load is under five seconds and road-closure transition is under two seconds on the demonstration machine.
- The scene aims for approximately 60 FPS where practical, with no obvious interaction or rendering stalls.
- The full core flow runs with zero runtime errors across repeated reset-and-scenario cycles.
- All required quality checks pass, and all fallback paths are demonstrated manually.

## Phase 7: Release Preparation and Presentation Rehearsal

**Goal:** Package the MVP so it can be shared and demonstrated confidently in 3-5 minutes.

**Deliverables:**

- Static demo published through the selected deployment path, or a verified local fallback if publishing is unavailable.
- Updated README and docs that accurately describe completed behavior and remaining limitations.
- A concise demo script based on the product vision's demo story.
- A rehearsed normal-state, scenario, impact, insight, and reset walkthrough.
- A final issue list that clearly separates required fixes from future enhancements.

**Dependencies:**

- Phase 6 hardened build and verified demo flow.

**Risks:**

- Last-minute scope additions or visual polish that destabilize the release.
- Deployment assumptions failing in the presentation environment.
- A demo narrative that overstates simulated results.

**Exit Criteria:**

- The demo runs from the intended presentation environment and has a local fallback.
- The 3-5 minute walkthrough completes reliably from a fresh start.
- The presenter can state that outputs are simulated, high-level insights rather than real-world predictions.
- Remaining work is recorded as future enhancement, not left as ambiguous MVP debt.

## Scope Control Rules

- The road-closure scenario is the required MVP path. Add a second scenario only after Phase 6 exit criteria are secure.
- Preserve deterministic fallback insights; do not make the demo depend on a live external insight service.
- Prefer simple geometry, focused camera framing, and clear traffic changes over additional districts, detailed models, or broader simulations.
- Fix correctness, reliability, and clarity before adding polish.

## Future Enhancements

These items are explicitly outside the one-week MVP and must not delay the phases above:

- Additional scenario types: bridge closure, flooding, construction, and accidents
- More districts or side-by-side scenario comparisons
- More nuanced traffic, congestion, or route behavior
- Optional validated insight-generation integration
- Saved scenarios, sharing, or persisted data
- Live maps, sensors, traffic data, accounts, collaboration, and other operational-platform features

Any future enhancement must enter through the existing module boundaries and retain a deterministic demo mode.
