import type { RoadClosureEffect, ScenarioDefinition } from '../model/scenario-definition';

/** Translates a validated scenario definition into the value consumed by simulation. */
export function createScenarioEffect(definition: ScenarioDefinition): RoadClosureEffect {
  return Object.freeze({
    kind: definition.kind,
    closedEdgeId: definition.targetEdgeId,
  });
}
