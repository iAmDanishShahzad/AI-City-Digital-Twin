import type { ScenarioId } from '@/core';

export type Insight = {
  readonly scenarioId: ScenarioId;
  readonly statements: readonly string[];
  readonly isFallback: boolean;
  readonly disclaimer: string;
};
