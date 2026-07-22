# AI City Digital Twin: Simulation Specification

## 1. Purpose

This document is the implementation contract for the MVP simulation domain. It defines the deterministic behavior required to show a believable consequence of a road closure in one fictional city district.

The simulation is illustrative. It is designed to make routing and congestion consequences visible and explainable in a live demo; it is not a scientifically calibrated traffic model or a real-world decision system.

For a given district definition, vehicle roster, simulation tick, and scenario state, every conforming implementation must produce the same simulation snapshot, analytics summary, and insight.

## 2. Terminology

| Term | Definition |
| --- | --- |
| Tick | One fixed logical simulation step. The MVP advances 10 ticks per simulated second. |
| Snapshot | An immutable record of complete simulation state after a completed tick. |
| Node | A stable graph point representing an intersection, origin, or destination. |
| Edge | A directed road connection from one node to another. |
| Route | An ordered, contiguous sequence of edges from an origin node to a destination node. |
| Vehicle | A configured, visible simulation entity that moves along a route or waits for one. |
| Scenario | A validated, bounded change to the normal district state. The required MVP scenario is one road closure. |
| Probe | A non-visible, fixed origin-to-destination route used to calculate a simulation access proxy. |
| Analytics | Deterministic calculations that compare scenario and baseline snapshots to produce impact facts. |
| Insight | The deterministic, user-facing explanation generated only from validated analytics and scenario context. |

## 3. Simulation Constants

All fixed values in this specification are collected here. Implementations must use these values consistently; they must not be replaced with random, frame-rate-dependent, or user-configurable values in the MVP.

| Constant | Value | Use |
| --- | --- | --- |
| District count | 1 | One fictional district is simulated. |
| Active scenario limit | 1 | Only one road closure may be active at a time. |
| Probe count | 2 | One emergency-access probe and one delivery-access probe. |
| Tick rate | 10 ticks per simulated second | Logical simulation cadence. |
| Tick duration | 0.1 simulated seconds | Duration of one logical tick. |
| Initial tick | 0 | Starting state for a new or reset simulation. |
| Base vehicle speed | 6 abstract distance units per simulated second | Uncongested vehicle movement. |
| Vehicle count | 8-12 visible vehicles | MVP roster limit. |
| Vehicle spawn window | Tick 0 through tick 29 | Allowed fixed `spawnTick` range. |
| Respawn delay | 20 ticks | Wait after a vehicle reaches its destination. |
| Route retry delay | 10 ticks | Wait after no valid route is available. |
| Node count | 8-12 nodes | MVP graph limit. |
| Directed edge count | 12-20 directed edges | MVP graph limit. |
| Closable edge count | 1 | Required road-closure target. |
| Edge-progress bounds | 0 through 1 inclusive | Valid range while a vehicle traverses an edge. |
| Base congestion multiplier | 1 | Minimum multiplier for an unoccupied edge. |
| Congestion contribution cap | 2 | Maximum occupancy-derived amount added to the base multiplier. |
| Maximum congestion multiplier | 3 | Upper bound on congestion slowdown. |
| Free-flow threshold | Occupancy ratio below 0.75 | Edge display classification. |
| Busy threshold | Occupancy ratio from 0.75 to below 1.25 | Edge display classification. |
| Congested threshold | Occupancy ratio 1.25 or greater | Edge display classification and congestion marker. |
| Affected-edge occupancy increase | 0.25 | Minimum scenario-to-baseline increase for an edge to be affected. |
| Moderate traffic-impact ratio | 20% of active vehicles rerouted | Analytics threshold. |
| High traffic-impact ratio | 50% of active vehicles rerouted | Analytics threshold. |
| Delayed-probe cost increase | 25% | Minimum scenario-to-baseline route-cost increase for a delayed probe. |
| Scenario scheduling delay | 1 logical tick | A selected closure is applied on the next tick. |
| Scenario response target | Under 2 seconds | Time for the closure, simulation, analytics, and insight to become visible. |
| Target rendering frame rate | Approximately 60 frames per second | Scene-performance target where practical. |

## 4. Simulation Flow

```text
District Definition
        |
        v
Road Graph
        |
        v
Simulation Loop
        |
        v
Analytics
        |
        v
Deterministic Insight Engine
        |
        v
UI
```

## 5. Simulation Scope

### Included in the MVP

- One static fictional district.
- A small directed road graph with a main corridor and at least one viable alternate route.
- A fixed, finite roster of visible vehicles.
- Continuous vehicle movement along graph edges.
- One road-closure scenario that prevents new entry to one configured road segment.
- Deterministic rerouting, congestion, analytics, insight generation, and reset behavior.

### Excluded from the MVP

- Real maps, live traffic, geographic calibration, weather, pedestrians, public transit, parking, traffic lights, collisions, and vehicle-to-vehicle avoidance.
- City-wide routing, route reservation, lane-level behavior, stochastic demand, and predictive traffic forecasting.
- Detailed emergency dispatch or delivery operations.
- Any claim that the output represents real-world travel time, safety, or operational advice.

## 6. World Model

The world is an immutable district definition plus an evolving simulation state.

### Immutable district definition

The district definition contains:

- A unique district identifier.
- A set of nodes and directed edges.
- Named areas and display metadata used only for presentation.
- A baseline vehicle roster.
- One emergency-access probe and one delivery-access probe.
- A supported road-closure scenario definition.

### Evolving simulation state

Each snapshot contains:

- `tick`: the completed logical tick number, starting at `0`.
- `scenarioState`: either normal or the configured road closure.
- `vehicles`: the complete state of every configured vehicle.
- `edgeOccupancy`: the number of vehicles currently traversing each edge.
- `scenarioEvents`: immutable records of the accepted scenario application, if any.

Snapshots are immutable values. A new tick creates a new snapshot; no consumer may mutate an existing snapshot.

## 7. Road Graph Model

The road network is a directed, weighted graph.

| Element | Required fields and rule |
| --- | --- |
| Node | Unique stable identifier and optional display position. Nodes represent intersections, origins, or destinations. |
| Edge | Unique stable identifier, `fromNodeId`, `toNodeId`, positive `length`, positive `capacity`, and `isClosable` flag. |
| Direction | Every permitted direction is a separate edge. A two-way road therefore has two directed edges. |
| Length | A positive abstract distance unit used consistently for movement and route cost. It is not a real-world distance. |
| Capacity | A positive integer used only by the congestion rule. It is not a physical lane or vehicle-capacity claim. |

MVP limits are:

- 8-12 nodes.
- 12-20 directed edges.
- Exactly one configured closable edge for the required road-closure scenario.
- At least one origin-to-destination pair whose preferred baseline route uses the closable edge and whose alternate path does not.

The catalog must reject a district that has duplicate identifiers, missing edge endpoints, non-positive length or capacity, or no alternate path for the required demonstration route.

## 8. Vehicle Model

Every visible vehicle is defined by a stable vehicle identifier and the following immutable configuration:

- `originNodeId`
- `destinationNodeId`
- `spawnTick`
- `baseSpeed` of `6` abstract distance units per simulated second

Every vehicle snapshot has one of these states:

| State | Required data | Meaning |
| --- | --- | --- |
| `scheduled` | next spawn tick | The vehicle is configured but not currently in the network. |
| `moving` | current edge, edge progress, route, route position | The vehicle is traversing an allowed edge. |
| `waiting` | node, route, remaining wait ticks | The vehicle has no valid route or has completed a trip. |

`edgeProgress` is a value in the inclusive range `0..1`. A moving vehicle has exactly one current edge and one ordered route. The route begins with the current edge and ends at the destination node.

Vehicles do not collide, overtake, change lane, or make discretionary stops. Their only behavior is deterministic route traversal, re-routing, waiting, and respawning.

## 9. Simulation Loop

The logical simulation advances in fixed steps of `0.1` simulated seconds (10 ticks per second). Rendering may interpolate snapshots, but interpolation must never alter logical simulation state.

For each tick, execute the following sequence exactly:

1. Apply all valid scenario events scheduled for this tick.
2. Count edge occupancy from the previous snapshot's moving vehicles.
3. Calculate each edge's congestion multiplier from that occupancy.
4. Replan routes for vehicles that are scheduled to spawn, are waiting for a route, or have reached a node in the previous tick.
5. Move each moving vehicle once using the pre-movement congestion multiplier.
6. Resolve completed-edge arrivals in ascending vehicle identifier order.
7. Mark vehicles that reached their destination as waiting for their fixed respawn delay.
8. Produce the next immutable snapshot with updated occupancy.

All collections must be evaluated in ascending stable identifier order. No behavior may depend on object insertion order, wall-clock time, random values, frame rate, or asynchronous completion order.

## 10. Vehicle Lifecycle

1. A vehicle begins as `scheduled`.
2. At its configured `spawnTick`, it requests a route from its origin to its destination.
3. If a route exists, it enters the first edge at progress `0` and becomes `moving`.
4. When it completes an edge, it reaches that edge's destination node.
5. If the destination node is reached, it becomes `waiting` for `20` ticks.
6. When that wait ends, it is scheduled to spawn again at its original origin and destination.
7. If no route exists at spawn or at a node, it becomes `waiting` for `10` ticks before attempting the same route request again.

Vehicles never reverse direction along an edge. A vehicle already on an edge when it becomes closed completes that traversal; it may not enter the closed edge again after reaching its next node.

## 11. Vehicle Spawning

- The MVP contains 8-12 visible vehicles.
- Each vehicle's `spawnTick` is a fixed integer from `0` through `29`.
- Vehicle definitions are ordered by ascending vehicle identifier before processing a tick.
- The district catalog must include enough traffic on the main corridor for the closure to cause a visible reroute or congestion response.
- No random origin, destination, speed, or spawn time is permitted.
- A vehicle that cannot find a route waits according to the lifecycle rule; it is not deleted, teleported, or assigned an invented route.

## 12. Routing Rules

### Route selection

- Routing uses Dijkstra's shortest-path algorithm over allowed directed edges.
- The route cost of an allowed edge is its `length` multiplied by its congestion multiplier for the current tick.
- A closed edge has no route cost because it is excluded from the graph entirely.
- A route is a contiguous ordered list of edges from origin to destination.
- A vehicle plans at spawn, after a waiting retry, and immediately after arriving at a node. It does not replan while it is partway through an edge.

### Tie breaking

When multiple paths have equal total cost, select the path whose ordered edge-identifier sequence is lexicographically smallest. This tie break is mandatory.

### Scenario re-routing

Immediately after a closure is applied, every vehicle whose remaining route contains the closed edge discards its remaining route. A vehicle currently traversing any edge completes that edge, then plans again at the next node. A scheduled or waiting vehicle at a node plans again before movement in that tick.

If no route exists, the vehicle enters the `waiting` state at its current node and retries after 10 ticks.

## 13. Congestion Model

Congestion is a simple, deterministic visual and routing signal. It is not a model of physical traffic flow.

For each allowed edge at the start of a tick:

```text
occupancyRatio = vehicleCountOnEdge / edgeCapacity
congestionMultiplier = 1 + min(2, occupancyRatio)
effectiveSpeed = baseSpeed / congestionMultiplier
```

Movement for a vehicle on an edge is:

```text
edgeProgressIncrease = (effectiveSpeed * 0.1) / edgeLength
```

The congestion multiplier is calculated once from the pre-movement occupancy and applies to all movement and route calculations for that tick.

| Occupancy ratio | Display classification |
| --- | --- |
| Less than `0.75` | Free-flowing |
| `0.75` to less than `1.25` | Busy |
| `1.25` or greater | Congested |

An edge may be visually marked as congested only when its ratio is `1.25` or greater. The maximum multiplier is `3`, preventing one edge from indefinitely slowing the simulation.

## 14. Scenario Rules

### Supported MVP scenario: road closure

The scenario definition contains a stable scenario identifier, label, target closable edge identifier, and presentation metadata. It has no user-supplied numeric parameters.

Rules:

1. The normal state has no closed edges.
2. Selecting the configured road closure schedules one closure event for the next logical tick.
3. At the start of that tick, the target edge becomes closed for all future route selection and entry.
4. Vehicles already on the target edge complete their current traversal under the congestion value calculated for that tick.
5. Vehicles not yet on the target edge must replan according to the scenario re-routing rules.
6. Re-selecting an already active closure is a no-op and must not create a second event.
7. The MVP permits only one active scenario at a time.
8. Reset is the only way to return from the active closure to normal state.

Future scenario types must be represented as explicit scenario effects. They must not change the road-closure rules by implication.

## 15. Analytics Specification

Analytics consumes immutable baseline and scenario snapshots; it never changes simulation state.

### Baseline comparison

The application maintains a normal-state baseline simulation from the same initial district and vehicle roster. It advances one baseline tick for every scenario tick. Analytics always compares the scenario snapshot with the baseline snapshot at the same tick number.

### Required metrics

| Metric | Rule |
| --- | --- |
| `reroutedVehicleCount` | Count of active vehicles whose planned route after a closure differs from the route in the same-tick baseline snapshot. |
| `waitingVehicleCount` | Count of vehicles waiting because no valid route exists; destination-respawn waits are excluded. |
| `congestedEdgeCount` | Count of allowed edges classified as Congested. |
| `trafficImpact` | `high` if `waitingVehicleCount > 0` or rerouted vehicles are at least 50% of active vehicles; `moderate` if rerouted vehicles are at least 20% or congested-edge count is greater than baseline; otherwise `low`. |
| `affectedEdgeIds` | The closed edge followed by any allowed edge whose occupancy ratio is at least `0.25` higher than its same-tick baseline ratio. Sort ascending. |

If there are no active vehicles, `trafficImpact` is `low` and the rerouted-vehicle ratio is treated as `0`.

### Emergency and delivery access proxies

The district catalog defines exactly two non-visible route probes:

- `emergencyAccessProbe`
- `deliveryAccessProbe`

Each probe has a fixed origin and destination. On every analytics update, calculate the probe's shortest route cost using the same edge costs and closure state as vehicle routing.

For each probe, compare its scenario cost with its same-tick baseline cost:

| Result | Rule |
| --- | --- |
| `unavailable` | No allowed scenario route exists. |
| `delayed` | Scenario cost is at least 25% greater than baseline cost. |
| `unchanged` | Neither preceding condition applies. |

Emergency and delivery results are **simulation proxies only**. They indicate route accessibility within this fictional graph; they are not real-world predictions of dispatch performance, medical outcome, delivery time, or operational capacity.

## 16. Deterministic Insight Engine

The MVP insight engine is deterministic template selection, not an external generative dependency. It consumes only the validated analytics summary and active scenario context.

The output always contains:

1. A scenario statement: the selected road is closed.
2. A traffic statement based on `trafficImpact`.
3. An emergency-access statement based on `emergencyAccessProbe`.
4. A delivery-access statement based on `deliveryAccessProbe`.
5. The disclaimer: “This is a simulated scenario, not a real-world prediction.”

Template selection is fixed:

| Input | Required statement |
| --- | --- |
| `trafficImpact = high` | “Traffic is heavily affected as vehicles reroute or wait for available paths.” |
| `trafficImpact = moderate` | “Traffic is affected as vehicles use alternate paths and pressure increases on nearby roads.” |
| `trafficImpact = low` | “Traffic impact is limited because most vehicles retain an available route.” |
| probe `unavailable` | “The simulated route is unavailable after the closure.” |
| probe `delayed` | “The simulated route remains available but has a higher route cost.” |
| probe `unchanged` | “The simulated route remains available with no material route-cost increase.” |

Statements are concatenated in the listed order. No random wording, external data, inferred cause, or unsupported metric may be added. If analytics validation fails, display a fixed safe message: “Simulation insight is unavailable. Reset the scenario to return to the baseline.”

## 17. Reset Behavior

Reset creates a new state from the immutable district definition. It must:

- Set the tick to `0`.
- Clear the active scenario and all scenario events.
- Restore every vehicle to its configured initial `scheduled` state.
- Clear edge occupancy, planned routes, waits, and derived analytics.
- Recreate the baseline simulation from tick `0`.
- Remove all scenario markers and restore normal presentation projection on the next published state.

Reset must not reuse mutable references from the state being reset. Repeating the same tick sequence after reset must reproduce the same snapshots as a fresh initial load.

## 18. Performance Constraints

- The simulation must use fixed logical ticks and must not couple its progression to rendering frame rate.
- The MVP district is limited to 12 nodes, 20 directed edges, and 12 visible vehicles.
- Route finding occurs only at spawn, waiting retry, node arrival, and scenario application—not on every rendered frame.
- Analytics and deterministic insight generation execute only after a new simulation snapshot or scenario-state change.
- Static district data must not be rebuilt during ordinary vehicle movement.
- The complete road-closure transition, including simulation, analytics, and insight update, must become visible in under 2 seconds on demonstration hardware.
- The displayed scene should aim for approximately 60 frames per second where practical.

## 19. Assumptions and Simplifications

- The district is fictional, compact, and purpose-built for visual clarity.
- Abstract lengths, capacities, speed, and route costs are internal demonstration values, not geographic or operational measurements.
- Every road is represented only by its permitted directed edges; lane geometry is not simulated.
- Vehicles share one base speed and differ only by configured route and spawn timing.
- Vehicles do not respond to each other beyond the edge-level congestion multiplier.
- A road closure affects entry and route availability immediately at a tick boundary, while vehicles already on the segment finish traversing it.
- A believable, repeatable visual outcome is more valuable than mathematical or scientific fidelity.
- The required MVP demonstration uses one road-closure scenario. Additional scenario types remain future enhancements until separately specified.

## 20. Future Extensions

The following are future enhancements only. They are outside the MVP and must preserve deterministic simulation behavior when separately specified and implemented:

- Bridge Closure
- Flooding
- Road Construction
- Accident
- Variable Vehicle Types
