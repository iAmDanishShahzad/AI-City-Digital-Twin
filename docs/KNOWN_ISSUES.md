# Known Issues

This document tracks intentionally postponed work. Record deferred items here rather than leaving unfinished-work markers in source code.

## Deferred

### Toolchain Advisory: brace-expansion

**Status:** Deferred

**Affected packages:**

- `eslint` (transitive path: `eslint` → `minimatch` → `brace-expansion`)
- `typescript-eslint` (transitive path: `@typescript-eslint/typescript-estree` → `minimatch` → `brace-expansion`)

**Reason:** The affected packages are development-only tooling. The available automated remediation is `npm audit fix --force`, which upgrades ESLint to a new major version and may disrupt the active linting configuration during the hackathon.

**Resolution:** Revisit after M14, when the MVP is feature-complete and stable. Create a `dependency-updates` branch, upgrade the linting toolchain, resolve any configuration changes, run the full quality suite, and merge only if every check passes.

**Mitigation:** The affected packages are omitted from a production install and process local repository file patterns rather than application runtime input. Do not run the forced audit fix during active MVP development.

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
