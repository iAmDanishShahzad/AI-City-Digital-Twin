# AI City Digital Twin: Glossary

| Term | Definition |
| --- | --- |
| Analytics | Derived impact metrics calculated from simulation snapshots. |
| Application | The layer that orchestrates user intents and domain use cases. |
| Baseline | The normal-state simulation used for same-tick comparison with a scenario. |
| Congestion multiplier | The occupancy-derived value that increases route cost and reduces vehicle speed. |
| Core | Dependency-free shared contracts, result types, and small utilities. |
| District | The fictional road network used in the MVP. |
| Edge | A directed road segment connecting two nodes. |
| Edge occupancy | The number of vehicles currently traversing an edge. |
| Infrastructure | An adapter boundary for external concerns; it does not own domain behavior. |
| Insight | Deterministic user-facing explanation generated from validated analytics. |
| Node | A road intersection, origin, or destination. |
| Presentation | The layer that renders projection data and emits user intent. |
| Probe | A non-visible route used only to calculate an access proxy. |
| Route | An ordered list of edges from origin to destination. |
| Road closure | The MVP scenario that prevents new entry to one configured edge. |
| Scenario | A validated user-triggered event that changes simulation state. |
| Scenario effect | The bounded domain change produced by a validated scenario. |
| Simulation | The deterministic domain behavior that advances traffic state. |
| Snapshot | Immutable simulation state at a specific completed tick. |
| Tick | One logical simulation update. |
| Traffic impact | The low, moderate, or high category derived from scenario traffic metrics. |
| Vehicle | A simulated traffic entity that follows a route or waits for one. |

Whenever a new domain term is introduced, add it here instead of redefining it in multiple documents.
