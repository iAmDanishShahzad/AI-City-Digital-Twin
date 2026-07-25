# Known Issues

This document tracks intentionally postponed work. Record deferred items here rather than leaving unfinished-work markers in source code.

## Deferred

### Rendering

**Reason:** The 3D district and scene rendering begin in M04. M01 and M02 establish tooling and domain contracts only.

### Three.js and React Three Fiber

**Reason:** These selected rendering dependencies are intentionally postponed until M04, when the project first needs them.

### District Catalog and Graph Validation

**Reason:** The fixed fictional district is scheduled for M03 and must be implemented after the M02 contracts it uses.

### Routing and Simulation Behavior

**Reason:** Deterministic route selection, vehicle lifecycle, and congestion behavior are scheduled for M05 through M07 after the district catalog is available.

### Road-Closure Scenario Behavior

**Reason:** Scenario validation, effects, rerouting, and reset behavior are scheduled for M08. M02 contains contracts only.

### Analytics and Deterministic Insights

**Reason:** Simulation-derived analytics and deterministic insight text are scheduled for M10 through M12, after scenario behavior exists.

### Runtime AI Integration

**Reason:** It is outside the MVP. The project uses deterministic, validated insight templates instead of an external AI runtime.
