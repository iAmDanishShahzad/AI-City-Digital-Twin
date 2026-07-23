import { describe, expect, it } from 'vitest';

import type { AnalyticsSummary } from '@/analytics';
import type { ApplicationError } from '@/core';
import type { DistrictDefinition } from '@/district';
import type { Insight } from '@/insights';
import type { ScenarioDefinition } from '@/scenarios';
import type { SimulationSnapshot } from '@/simulation';

import { applicationReducer, initialApplicationState } from './index';
import type { ApplicationSession } from './index';

const district: DistrictDefinition = {
  id: 'district-central',
  nodes: [],
  edges: [],
  display: {
    label: 'Central District',
    areas: [],
  },
  baselineVehicles: [],
  emergencyAccessProbe: {
    id: 'emergency-access',
    originNodeId: 'north',
    destinationNodeId: 'hospital',
  },
  deliveryAccessProbe: {
    id: 'delivery-access',
    originNodeId: 'warehouse',
    destinationNodeId: 'market',
  },
};

const baselineSnapshot: SimulationSnapshot = {
  tick: 0,
  scenarioState: { kind: 'normal' },
  vehicles: [],
  edgeOccupancy: {},
  scenarioEvents: [],
};

const closureScenario: ScenarioDefinition = {
  id: 'main-corridor-closure',
  kind: 'road-closure',
  targetEdgeId: 'main-corridor-eastbound',
  presentation: {
    label: 'Close Main Corridor',
    description: 'Closes the eastbound main corridor.',
  },
};

const recoverableError: ApplicationError = {
  code: 'simulation-failed',
  message: 'The simulation update could not be completed.',
  isRecoverable: true,
};

const analytics: AnalyticsSummary = {
  reroutedVehicleCount: 0,
  waitingVehicleCount: 0,
  congestedEdgeCount: 0,
  trafficImpact: 'low',
  affectedEdgeIds: [],
  emergencyAccess: {
    impact: 'unchanged',
    baselineRouteCost: 10,
    scenarioRouteCost: 10,
    isSimulationProxy: true,
  },
  deliveryAccess: {
    impact: 'unchanged',
    baselineRouteCost: 10,
    scenarioRouteCost: 10,
    isSimulationProxy: true,
  },
};

const insight: Insight = {
  scenarioId: closureScenario.id,
  statements: [],
  isFallback: false,
  disclaimer: 'This is a simulated scenario, not a real-world prediction.',
};

function createSession(currentSnapshot: SimulationSnapshot = baselineSnapshot): ApplicationSession {
  return {
    district,
    baselineSnapshot,
    currentSnapshot,
    analytics: null,
    insight: null,
  };
}

describe('applicationReducer', () => {
  it('moves through the documented scenario transition states', () => {
    const initialized = applicationReducer(initialApplicationState, {
      type: 'initialize',
      session: createSession(),
    });
    const applyingScenario = applicationReducer(initialized, {
      type: 'select-scenario',
      scenario: closureScenario,
    });
    const simulating = applicationReducer(applyingScenario, { type: 'start-simulation' });
    const updatedSnapshot: SimulationSnapshot = {
      ...baselineSnapshot,
      tick: 1,
    };
    const updated = applicationReducer(simulating, {
      type: 'update-snapshot',
      snapshot: updatedSnapshot,
    });
    const analyzing = applicationReducer(updated, { type: 'start-analysis' });
    const ready = applicationReducer(analyzing, {
      type: 'complete-analysis',
      analytics,
      insight,
    });

    expect(initialized.status).toBe('ready');
    expect(applyingScenario.status).toBe('applying-scenario');
    expect(simulating.status).toBe('simulating');
    expect(updated.status).toBe('simulating');
    expect(updated.status === 'simulating' && updated.currentSnapshot.tick).toBe(1);
    expect(analyzing.status).toBe('analyzing');
    expect(ready).toEqual({
      status: 'ready',
      ...createSession(updatedSnapshot),
      analytics,
      insight,
    });
  });

  it('returns the supplied deterministic baseline session on reset', () => {
    const initialized = applicationReducer(initialApplicationState, {
      type: 'initialize',
      session: createSession({ ...baselineSnapshot, tick: 4 }),
    });
    const reset = applicationReducer(initialized, {
      type: 'reset',
      session: createSession(),
    });

    expect(reset).toEqual({
      status: 'ready',
      ...createSession(),
    });
  });

  it('preserves and recovers the last valid state after a recoverable error', () => {
    const ready = applicationReducer(initialApplicationState, {
      type: 'initialize',
      session: createSession(),
    });
    const failed = applicationReducer(ready, {
      type: 'report-error',
      error: recoverableError,
    });
    const recovered = applicationReducer(failed, { type: 'recover' });

    expect(failed.status).toBe('error');
    expect(failed.status === 'error' && failed.lastValidState).toBe(ready);
    expect(recovered).toBe(ready);
  });
});
