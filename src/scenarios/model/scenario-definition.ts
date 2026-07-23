import type { EdgeId, ScenarioId, ScenarioState } from '@/core';

export type ScenarioKind = 'road-closure';

export type ScenarioPresentationMetadata = {
  readonly label: string;
  readonly description: string;
};

export type RoadClosureScenarioDefinition = {
  readonly id: ScenarioId;
  readonly kind: 'road-closure';
  readonly targetEdgeId: EdgeId;
  readonly presentation: ScenarioPresentationMetadata;
};

export type ScenarioDefinition = RoadClosureScenarioDefinition;

export type RoadClosureEffect = {
  readonly kind: 'road-closure';
  readonly closedEdgeId: EdgeId;
};

export type ScenarioEffect = RoadClosureEffect;

export type ScheduledScenarioEvent = {
  readonly scenarioId: ScenarioId;
  readonly scheduledTick: number;
};

export type ScenarioContext = {
  readonly definition: ScenarioDefinition;
  readonly state: ScenarioState;
};
