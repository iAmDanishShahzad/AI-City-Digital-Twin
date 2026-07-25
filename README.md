# AI City Digital Twin

An open-source, deterministic urban-planning simulator for exploring the consequences of change in a fictional 3D city district.

> **Project status:** Active development. M01–M04 are complete: the project has a strict toolchain, typed domain contracts, a validated Central District graph, and a static north-up 3D baseline scene.

## Project overview

AI City Digital Twin is an interactive experience for testing urban "what-if" scenarios before they happen in the real world. It models a small city district in 3D, will simulate changing conditions in deterministic logical ticks, and will present clear, grounded explanations of simulated effects.

The project is designed to make complex urban systems easier to explore for both technical and non-technical users, while demonstrating thoughtful simulation design and maintainable software engineering.

## Problem statement

Urban disruptions, such as road or bridge closures, flooding, construction, and accidents, can affect traffic, emergency response, and delivery operations across an entire district. Understanding those interconnected consequences is difficult when information is fragmented, static, or too technical to use confidently.

## Proposed solution

AI City Digital Twin provides a read-only baseline district view today and will provide an interactive 3D environment where users can introduce the supported road-closure scenario, observe deterministic traffic changes, and receive a grounded explanation of the resulting simulated impacts.

## Key features

- **Available now:** A validated fictional Central District with eight nodes, 16 directed edges, one closable edge, named areas, deterministic vehicle definitions, and a north-up static 3D scene.
- **Available now:** A presentation projection that keeps the rendering layer separate from immutable district data.
- **Planned MVP:** One road-closure scenario, deterministic vehicle movement and rerouting, congestion indicators, impact metrics, and deterministic insight templates.
- **Future enhancements:** Bridge closure, flooding, road construction, accident scenarios, and variable vehicle types.

## Why this project matters

City systems are tightly connected: a local disruption can create broader effects that are hard to anticipate. By making those effects visible and explainable, AI City Digital Twin aims to help people reason about urban resilience, operational trade-offs, and the importance of proactive planning.

## Target users

- Urban planners and city stakeholders exploring potential interventions
- Emergency-response and operations teams assessing disruption scenarios
- Logistics and mobility teams considering route and service impacts
- Students, researchers, and civic-technology communities learning from urban-system simulations
- Non-technical decision-makers who need clear explanations, not only raw simulation data

## High-level architecture

The project will be organized as modular, testable layers:

```text
User interaction
      |
      v
Scenario management
      |
      v
Simulation engine --> Impact analysis --> AI-generated insights
      |
      v
3D city visualization
```

This separation is intended to keep the experience responsive, make major features independently testable, and allow the simulation, visualization, and insight-generation concerns to evolve without unnecessary coupling.

## Technology stack

The current MVP stack is deliberately small and local-first:

- **TypeScript** with strict typing
- **React** and **Vite**
- **Three.js**, **React Three Fiber**, and **Drei** for the 3D scene
- **CSS Modules**, **ESLint**, **Prettier**, **Vitest**, and Testing Library
- **npm** and Git

See [TECH_STACK.md](docs/TECH_STACK.md) for the complete selection rationale and intentional exclusions.

## Development methodology

Development follows an incremental, quality-focused approach:

- Deliver one major feature at a time.
- Verify each feature before moving to the next.
- Favor clean architecture, small modules, reusable components, and readable code.
- Keep performance in focus, with a target of 60 FPS whenever practical.
- Maintain strong typing, avoid duplication and dead code, and keep linting clean.
- Update documentation alongside meaningful product changes.

## Folder structure

The project uses a domain-first layout. Only currently implemented directories are shown:

```text
AI-City-Digital-Twin/
|-- src/
|   |-- app/                 # composition and application state
|   |-- core/                # shared result, error, and identifier contracts
|   |-- district/            # immutable Central District catalog and validation
|   |-- presentation/        # projection and static 3D scene
|   |-- analytics/           # contracts only; rules arrive later
|   |-- insights/            # contracts only; templates arrive later
|   |-- scenarios/           # contracts only; catalog/effects arrive later
|   |-- simulation/          # contracts only; engine arrives later
|   `-- test/                # shared test setup
|-- docs/
`-- README.md
```

See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for module boundaries, naming, imports, and future expansion rules.

## Current project status

The application currently displays the static, graph-aligned Central District. Routing, vehicle movement, simulation, congestion, the road-closure scenario, analytics, insights, and controls remain intentionally deferred to later milestones.

## Future roadmap

Next, the project will implement deterministic route selection, fixed-tick vehicle lifecycle, congestion, the road-closure scenario, visible traffic, analytics, and deterministic insights. A presentation-only visual-polish task is reserved after core scenario behavior is complete and before traffic is connected to the scene. See [MILESTONES.md](docs/MILESTONES.md) and [ROADMAP.md](docs/ROADMAP.md).

## License

License to be determined.
