# Architecture Decisions

## ADR-001: Deterministic Simulation

Status: Accepted

Decision:
The MVP uses a deterministic simulation with fixed ticks, immutable snapshots, and no random behavior.

Reason:
Repeatable behavior simplifies testing, debugging, and demonstration.

---

## ADR-002: Fictional City District

Status: Accepted

Decision:
The simulation uses a fictional district instead of real map data.

Reason:
Reduces complexity, avoids external data dependencies, and keeps the project achievable within the hackathon.

---

## ADR-003: Single Required Scenario

Status: Accepted

Decision:
Only the road-closure scenario is required for the MVP.

Reason:
Allows the team to polish one complete user journey instead of partially implementing multiple scenarios.

---

## ADR-004: Deterministic Insight Engine

Status: Accepted

Decision:
The MVP uses deterministic templates instead of a runtime Large Language Model (LLM).

Reason:
Ensures reliable offline demos and avoids external AI dependencies while remaining extensible.

---

## ADR-005: Projection-Only Rendering

Status: Accepted

Decision:
The rendering scene consumes immutable presentation projection objects only. Public immutable district contracts may be read while creating a projection, but rendering components must not read or mutate domain objects directly.

Reason:
This keeps 3D concerns separate from domain behavior, makes scene tests and future dynamic traffic updates safer, and prevents rendering state from becoming a source of truth.

---

**Rule going forward:** Every significant architectural change gets a new ADR entry. Never silently change the architecture.
