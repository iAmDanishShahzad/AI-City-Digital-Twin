import type { EdgeId, ScenarioId } from '@/core';
import type { DistrictDefinition } from '@/district';

import type { ScenarioEvent, SimulationSnapshot } from '../model/simulation-snapshot';

export type RoadClosureScheduleInput = {
  readonly district: DistrictDefinition;
  readonly snapshot: SimulationSnapshot;
  readonly scenarioId: ScenarioId;
  readonly closedEdgeId: EdgeId;
};

/** Schedules one valid closure for the next logical tick without activating it early. */
export function scheduleRoadClosure(input: RoadClosureScheduleInput): SimulationSnapshot {
  if (!canSchedule(input)) {
    return input.snapshot;
  }

  const scheduledTick = input.snapshot.tick + 1;
  const event: ScenarioEvent = Object.freeze({
    id: `${input.scenarioId}@${scheduledTick}`,
    scenarioId: input.scenarioId,
    closedEdgeId: input.closedEdgeId,
    scheduledTick,
    appliedTick: null,
  });

  return Object.freeze({
    ...input.snapshot,
    scenarioEvents: Object.freeze([...input.snapshot.scenarioEvents, event]),
  });
}

function canSchedule(input: RoadClosureScheduleInput): boolean {
  if (input.snapshot.scenarioState.kind !== 'normal') {
    return false;
  }

  if (input.snapshot.scenarioEvents.some((event) => event.appliedTick === null)) {
    return false;
  }

  return input.district.edges.some((edge) => edge.id === input.closedEdgeId && edge.isClosable);
}
