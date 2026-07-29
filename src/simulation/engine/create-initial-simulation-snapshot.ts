import { compareText, type ScenarioState } from '@/core';
import type { DistrictDefinition } from '@/district';

import type { ScheduledVehicleState, SimulationSnapshot } from '../model/simulation-snapshot';
import { simulationConstants } from './simulation-constants';
import { deriveEdgeTraffic } from '../traffic/derive-edge-traffic';

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
  const traffic = deriveEdgeTraffic({ district, vehicles });

  return Object.freeze({
    tick: simulationConstants.initialTick,
    scenarioState: normalScenarioState,
    vehicles: Object.freeze(vehicles),
    edgeOccupancy: traffic.edgeOccupancy,
    edgeTraffic: traffic.edgeTraffic,
    scenarioEvents: Object.freeze([]),
  });
}
