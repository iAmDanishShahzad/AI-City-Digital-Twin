# AI City Digital Twin: System Architecture

## 1. Purpose

This document defines the system boundaries, layers, responsibilities, and information flows for AI City Digital Twin. It is implementation-independent and is the reference for future work on the MVP: a deterministic, interactive simulation of one small city district.

The architecture prioritizes a reliable, understandable live demonstration over real-world predictive accuracy. It must make it straightforward to select a disruption, observe its effect, and understand the resulting impact.

## 2. Architectural Goals

- Keep each component focused on one responsibility.
- Separate user interaction, orchestration, domain logic, visual presentation, and insight generation.
- Support a deterministic, repeatable demo with no dependency on live external data.
- Make scenarios, simulation rules, analytics, and visual presentation independently testable.
- Keep the MVP small while allowing new scenarios and analysis capabilities to be added without reworking the core.
- Preserve a responsive visual experience during simulation updates.
- Fail safely: an unavailable insight generator must not prevent the simulation or demo from completing.

## 3. High-Level Architecture

```text
                    +------------------------+
                    |   User Interaction     |
                    +-----------+------------+
                                |
                                v
+-------------------+  +--------+---------+  +-------------------+
| District Catalog  |->| Application       |->| Presentation      |
| and Scenario      |  | Orchestrator      |  | Projection        |
| Definitions       |  +--------+---------+  +--------+----------+
+-------------------+           |                     |
                                v                     v
                       +--------+---------+  +--------+----------+
                       | Simulation       |  | 3D and Interface  |
                       | Domain           |  | Rendering          |
                       +--------+---------+  +-------------------+
                                |
                                v
                       +--------+---------+
                       | Impact Analytics |
                       +--------+---------+
                                |
                                v
                       +--------+---------+
                       | Insight Service  |
                       +------------------+
```

The **Application Orchestrator** is the only layer that coordinates the flow between components. Domain components do not directly control the interface or rendering. Presentation components do not change simulation rules.

## 4. Core Components

| Component | Primary responsibility |
| --- | --- |
| User Interaction | Collect and validate a user's intended action. |
| Application Orchestrator | Coordinate state transitions and invoke the appropriate domain services. |
| District Catalog | Supply the fixed district topology, baseline traffic setup, and visual metadata. |
| Scenario Catalog | Define allowed scenario types, parameters, and their domain effects. |
| Simulation Domain | Advance the deterministic traffic model for the current district state. |
| Impact Analytics | Derive meaningful, high-level impact measures from simulation results. |
| Insight Service | Convert analytics and scenario context into concise, user-facing explanations. |
| Presentation Projection | Transform application and domain state into display-ready view data. |
| Rendering | Draw the district, vehicles, scenario effects, and interface. |
| Error Boundary and Telemetry | Contain failures, produce safe fallbacks, and expose diagnostics. |

## 5. Component Responsibilities

### User Interaction

Presents the available actions, such as choosing a scenario or resetting the district. It performs basic input validation and sends an intent to the Application Orchestrator. It does not interpret traffic behavior or calculate impacts.

### Application Orchestrator

Owns the current application state and coordinates user actions. It applies a valid scenario, requests simulation updates, requests analytics and insights, and publishes an updated presentation projection. It does not contain traffic rules, visual drawing logic, or insight wording.

### District Catalog

Provides immutable source data for the MVP district: roads, connections, baseline vehicle setup, named areas, and display labels. It does not track live vehicle positions or scenario state.

### Scenario Catalog

Defines each supported disruption and the bounded changes it may apply to the district, such as making a road unavailable. It validates scenario parameters and produces a scenario effect description. It does not run the simulation or determine user-facing prose.

### Simulation Domain

Maintains the evolving simulation state, including vehicle progress, route availability, and traffic conditions. Given the same district definition, scenario effect, and elapsed time, it produces the same result. It does not know about controls, layout, or user messaging.

### Impact Analytics

Compares the current simulation result with the baseline or prior result and produces a small, defined set of impact facts. For the MVP, these facts describe traffic flow and high-level effects on emergency access and delivery routes. It does not produce visual assets or free-form explanations.

### Insight Service

Transforms validated impact facts and scenario context into short, plain-language explanations. It must support a predefined fallback explanation for every supported scenario. It must not invent conditions absent from the analytics input.

### Presentation Projection

Maps domain state into a stable, display-ready model: road status, vehicle positions, affected areas, metrics, labels, and insight text. This isolates rendering concerns from domain concepts.

### Rendering

Renders the visual district and interface from the presentation projection. It draws current state only and sends user intent upward; it must not mutate simulation state.

### Error Boundary and Telemetry

Captures unexpected failures, provides the user with a safe recovery action, and records concise diagnostic context. It does not conceal invalid simulation results as successful outcomes.

## 6. Data Flow

```text
District + scenario definitions
             |
             v
User chooses an action --> Orchestrator validates it
             |                    |
             |                    v
             |            Scenario effect is applied
             |                    |
             |                    v
             |            Simulation advances state
             |                    |
             |                    v
             |            Analytics derives impact facts
             |                    |
             |                    v
             +------------> Insight Service
                                  |
                                  v
                    Presentation Projection --> Rendering
```

Only immutable definitions flow into the simulation. The simulation emits state snapshots; downstream components consume those snapshots and produce derived outputs. Derived outputs must never be written back as simulation inputs.

## 7. Application States

| State | Meaning | Permitted next states |
| --- | --- | --- |
| Initializing | District and baseline data are being prepared. | Ready, Error |
| Ready | Baseline district is visible and awaits an action. | Applying Scenario, Simulating, Error |
| Applying Scenario | A selected scenario is being validated and applied. | Simulating, Ready, Error |
| Simulating | Traffic state advances and the scene updates. | Analyzing, Ready, Error |
| Analyzing | Impact facts and insight content are being prepared. | Ready, Error |
| Error | A recoverable failure is shown with a reset or retry action. | Initializing, Ready |

For the MVP, a scenario transition may move quickly from **Applying Scenario** through **Simulating** and **Analyzing** while the scene visibly updates. Reset restores the initial deterministic baseline.

## 8. Simulation Pipeline

1. Load the immutable district definition and baseline vehicle configuration.
2. Create a baseline simulation snapshot.
3. Apply the validated scenario effect to route availability or other supported district conditions.
4. Determine eligible routes for each affected vehicle.
5. Advance vehicle movement in bounded simulation steps.
6. Calculate route progress and congestion indicators.
7. Emit a new immutable simulation snapshot.

The MVP pipeline is intentionally constrained to a compact road network and predefined conditions. It prioritizes clear, believable visual behavior over high-fidelity traffic modeling.

## 9. Scenario Pipeline

1. Receive a user-selected scenario identifier and permitted parameters.
2. Confirm the scenario exists and is valid for the current district state.
3. Translate it into a domain effect, such as a closed segment or constrained route.
4. Apply the effect to a copy of the baseline or current domain state.
5. Label the resulting state for analytics and presentation.
6. Reject invalid or unsupported actions with a clear, recoverable response.

Scenario definitions are data-driven so a future scenario can be added by defining its validation, effect, and fallback insight without modifying unrelated components.

## 10. Analytics Pipeline

1. Accept a baseline snapshot, current simulation snapshot, and scenario context.
2. Calculate the small set of MVP impact facts, such as affected routes, relative congestion, and qualitative access implications.
3. Apply thresholds or rules that convert raw simulation values into stable, explainable categories.
4. Validate that each fact is supported by the simulation state.
5. Publish an immutable impact summary for presentation and insight generation.

Analytics must report simulation-derived observations, not real-world predictions.

## 11. AI Insight Pipeline

```text
Scenario context + validated impact summary
                    |
                    v
          Insight request construction
                    |
                    v
     Optional explanation generation or fallback
                    |
                    v
       Validation against known impact facts
                    |
                    v
            Short user-facing insight
```

The pipeline treats insight generation as optional enhancement. A known, scenario-specific fallback must always be available. Generated text is constrained to the supplied scenario and impact summary, clearly framed as a simulated outcome, and rejected or replaced when it is unavailable, malformed, or inconsistent with known facts.

## 12. Rendering Pipeline

1. Receive the latest presentation projection.
2. Update static district elements only when the district or scenario changes.
3. Update dynamic vehicle positions and traffic indicators for each simulation snapshot.
4. Render scenario markers, affected routes, and the impact summary.
5. Present the insight alongside the visual change it describes.

Rendering consumes a read-only projection. It must degrade gracefully if a non-critical visual element is unavailable, preserving scenario controls and core explanatory content.

## 13. Error Handling Strategy

- Validate user actions and scenario definitions at their boundary.
- Use explicit success or failure results between orchestration and domain components.
- Preserve the last known valid state when a scenario application or simulation update fails.
- Provide reset and retry paths that restore a deterministic baseline.
- Fall back to predefined insight text when optional explanation generation fails.
- Show user-friendly messages without exposing internal diagnostics.
- Record actionable diagnostic context: state, scenario identifier, component, and error category.
- Treat invalid domain data as a visible failure; do not silently substitute plausible-looking results.

## 14. Performance Strategy

- Keep the district, vehicle count, and supported scenario set intentionally small for the MVP.
- Separate static district data from dynamic simulation data.
- Update only changed presentation data and dynamic visual elements during movement.
- Use bounded simulation steps and simple deterministic route rules.
- Avoid repeated analytics or insight work when input state has not changed.
- Keep user actions responsive by isolating expensive work from the critical interaction path where necessary.
- Measure the complete scenario transition and visual frame rate on demonstration hardware.

The target is a consistently responsive demonstration, aiming for approximately 60 frames per second where practical and a scenario transition that feels immediate.

## 15. Scalability Considerations

The MVP does not require city-scale capacity. However, clear boundaries permit future scale without changing the core user flow:

- Replace or extend the District Catalog to load additional districts.
- Add scenario definitions without altering the rendering or orchestration contracts.
- Evolve the Simulation Domain behind its snapshot interface as modeling needs grow.
- Add analytics measures as new, versioned fields rather than coupling them to presentation.
- Move optional insight generation behind a stable request and response boundary.
- Partition district state by region only when larger-world simulations justify the additional complexity.

Scale-related work must be driven by a defined product need; it is not part of the one-week MVP.

## 16. Security Considerations

The MVP has no accounts, personal data, or operational control. Its security posture should remain minimal and appropriate to that scope:

- Treat all user-provided scenario inputs as untrusted and validate against supported definitions.
- Do not expose credentials, configuration secrets, or internal diagnostics in the user interface.
- Keep optional external insight requests isolated and supply only the minimum scenario and aggregated impact context necessary.
- Do not present simulation output as an authoritative public-safety or operational recommendation.
- Avoid collecting or persisting user data unless a later product decision explicitly requires it.

## 17. Future Extension Points

- Additional predefined scenario types, including bridge closures, flooding, construction, and accidents
- Additional districts and district catalogs
- More nuanced routing and congestion rules
- Side-by-side baseline and scenario comparison
- Additional impact categories, while preserving clear separation from real-world forecasts
- Alternative insight providers or richer locally defined insight templates
- Optional saved scenarios or data integrations, subject to explicit future product decisions

Each extension must preserve the existing component contracts, retain a deterministic demo mode, and justify its effect on scope and performance.

## 18. Architecture Principles

1. **Single responsibility.** Each component owns one clear concern and delegates all others.
2. **Layered dependencies.** Interaction and rendering depend on application contracts; domain logic does not depend on presentation.
3. **Deterministic by default.** The same input produces the same simulation and fallback insight result.
4. **Immutable boundaries.** Components exchange snapshots and value data, avoiding hidden shared mutation.
5. **Explicit state.** Application transitions and failures are observable and recoverable.
6. **Presentation is a projection.** Visual output reflects domain state; it never becomes the source of truth.
7. **Graceful enhancement.** Optional insight generation improves the experience but cannot block it.
8. **Simplicity over false precision.** A clear, believable simulation is preferable to an opaque or overbuilt model.
9. **Testability is a design constraint.** Scenario, simulation, analytics, and insight behavior must be verifiable in isolation.
10. **MVP discipline.** New work must strengthen the core story or remain deferred.
