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

This reduces complexity, avoids external data dependencies, and keeps the project achievable within the hackathon.

---

## ADR-003: Single Required Scenario

Status: Accepted

Decision:

Only the road-closure scenario is required for the MVP.

Reason:

This allows the team to polish one complete user journey instead of partially implementing multiple scenarios.

---

## ADR-004: Deterministic Insight Engine

Status: Accepted

Decision:

The MVP uses deterministic templates instead of a runtime large language model.

Reason:

This ensures reliable offline demos and avoids external AI dependencies while remaining extensible.

---

**Rule going forward:** Every significant architectural change gets a new ADR entry. Never silently change the architecture.
