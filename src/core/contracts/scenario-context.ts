import type { EdgeId, ScenarioId } from './identifiers';

export type NormalScenarioState = {
  readonly kind: 'normal';
};

export type RoadClosureScenarioState = {
  readonly kind: 'road-closure';
  readonly scenarioId: ScenarioId;
  readonly closedEdgeId: EdgeId;
};

export type ScenarioState = NormalScenarioState | RoadClosureScenarioState;
