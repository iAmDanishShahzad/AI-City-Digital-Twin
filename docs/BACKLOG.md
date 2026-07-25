# Project Backlog

This backlog records small, intentionally deferred tasks that do not change the approved milestone scope. Complete an item only when its stated prerequisites are met and it remains valuable to the demo.

## M04 Visual Polish — Presentation Only

**Planned window:** After M08 (Road-Closure Scenario and Reset) and before M09 (Simulated Traffic in the Scene). This is an optional backlog task, not an implementation milestone.

**Purpose:** Refine the static district presentation using the completed simulation as visual context, so later vehicle movement, congestion, and closure markers remain easy to read during the final demo.

### Scope

- Improve camera framing so the district occupies most of the viewport at initial load.
- Refine the visual distinction of the primary corridor and alternative route.
- Adjust road widths and label placement for readability with moving vehicles.
- Reduce avoidable empty canvas space while preserving a clear north-up orientation.
- Improve simple area labels and landmark readability.

### Constraints

- Presentation changes only.
- Preserve graph topology, node identities, edge identities, and semantic relationships. Presentation-only coordinate adjustments are permitted when they improve readability and do not alter routing semantics.
- Do not add routing, vehicle movement, simulation, congestion, closure behavior, analytics, insights, or controls.
- Use only the existing lightweight geometric rendering approach; do not add textures, imported 3D models, or new rendering dependencies.

### Exit Criteria

- The normal, moving-traffic, and closure views remain readable at the target demonstration viewport.
- The main corridor, alternative route, named areas, vehicles, and future closure marker do not visually overlap in a confusing way.
- Presentation tests and the full quality suite pass.
