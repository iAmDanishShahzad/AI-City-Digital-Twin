# AI City Digital Twin: Glossary

| Term | Definition |
| --- | --- |
| Analytics | Derived metrics calculated from simulation state. |
| Application | The layer that orchestrates user intents and domain use cases. |
| Baseline | The normal-state simulation used for same-tick comparison with a scenario. |
| Congestion multiplier | The occupancy-derived value that increases route cost and reduces vehicle speed. |
| Core | Dependency-free shared contracts, result types, and small utilities. |
| District | The fictional road network used in the MVP. |
| Edge | Directed road segment connecting two nodes. |
| Edge occupancy | The number of vehicles currently traversing an edge. |
| Infrastructure | An adapter boundary for external concerns; it does not own domain behavior. |
| Insight | Deterministic natural-language explanation generated from validated analytics. |
| Node | Road intersection, origin, or destination. |
| Presentation | The layer that renders projection data and emits user intent. |
| Probe | A non-visible route used only to calculate an access proxy. |
| Route | Ordered list of edges from origin to destination. |
| Road closure | The MVP scenario that prevents new entry to one configured edge. |
| Scenario | Validated user-triggered event that changes the simulation state. |
| Scenario effect | The bounded domain change produced by a validated scenario. |
| Simulation | The deterministic domain behavior that advances traffic state. |
| Snapshot | Immutable simulation state at a specific completed tick. |
| Tick | One logical simulation update. |
| Traffic impact | The low, moderate, or high category derived from scenario traffic metrics. |
| Vehicle | Simulated traffic entity following a route or waiting for one. |

Whenever a new domain term is introduced, add it here instead of redefining it in multiple documents.
