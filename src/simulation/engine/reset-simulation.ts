import type { DistrictDefinition } from '@/district';

import type { SimulationSnapshot } from '../model/simulation-snapshot';
import { createInitialSimulationSnapshot } from './create-initial-simulation-snapshot';

/** Recreates the complete normal-state snapshot from immutable district source data. */
export function resetSimulation(district: DistrictDefinition): SimulationSnapshot {
  return createInitialSimulationSnapshot(district);
}
