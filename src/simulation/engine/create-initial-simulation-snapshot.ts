import { compareText, type ScenarioState } from '@/core';
import type { DistrictDefinition } from '@/district';

import type {
  EdgeOccupancy,
  ScheduledVehicleState,
  SimulationSnapshot,
} from '../model/simulation-snapshot';
import { simulationConstants } from './simulation-constants';

const normalScenarioState: ScenarioState = Object.freeze({ kind: 'normal' });

/** Creates the immutable, all-scheduled baseline snapshot at logical tick zero. */
export function createInitialSimulationSnapshot(district: DistrictDefinition): SimulationSnapshot {
  const vehicles = district.baselineVehicles
    .map((vehicle): ScheduledVehicleState =>
      Object.freeze({
        kind: 'scheduled',
        vehicleId: vehicle.id,
        nextSpawnTick: vehicle.spawnTick,
      }),
    )
    .sort((first, second) => compareText(first.vehicleId, second.vehicleId));

  return Object.freeze({
    tick: simulationConstants.initialTick,
    scenarioState: normalScenarioState,
    vehicles: Object.freeze(vehicles),
    edgeOccupancy: createEmptyEdgeOccupancy(district),
    scenarioEvents: Object.freeze([]),
  });
}

function createEmptyEdgeOccupancy(district: DistrictDefinition): EdgeOccupancy {
  const occupancy: Record<string, number> = {};

  for (const edge of district.edges) {
    occupancy[edge.id] = 0;
  }

  return Object.freeze(occupancy);
}
