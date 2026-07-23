import type { AnalyticsSummary } from '@/analytics';
import type { ApplicationError } from '@/core';
import type { DistrictDefinition } from '@/district';
import type { Insight } from '@/insights';
import type { ScenarioDefinition } from '@/scenarios';
import type { SimulationSnapshot } from '@/simulation';

export type ApplicationSession = {
  readonly district: DistrictDefinition;
  readonly baselineSnapshot: SimulationSnapshot;
  readonly currentSnapshot: SimulationSnapshot;
  readonly analytics: AnalyticsSummary | null;
  readonly insight: Insight | null;
};

export type InitializingApplicationState = {
  readonly status: 'initializing';
};

export type ReadyApplicationState = ApplicationSession & {
  readonly status: 'ready';
};

export type ApplyingScenarioApplicationState = ApplicationSession & {
  readonly status: 'applying-scenario';
  readonly selectedScenario: ScenarioDefinition;
};

export type SimulatingApplicationState = ApplicationSession & {
  readonly status: 'simulating';
  readonly selectedScenario: ScenarioDefinition;
};

export type AnalyzingApplicationState = ApplicationSession & {
  readonly status: 'analyzing';
  readonly selectedScenario: ScenarioDefinition;
};

export type RecoverableApplicationState =
  | ReadyApplicationState
  | ApplyingScenarioApplicationState
  | SimulatingApplicationState
  | AnalyzingApplicationState;

export type ErrorApplicationState = {
  readonly status: 'error';
  readonly error: ApplicationError;
  readonly lastValidState: RecoverableApplicationState | null;
};

export type ApplicationState =
  | InitializingApplicationState
  | ReadyApplicationState
  | ApplyingScenarioApplicationState
  | SimulatingApplicationState
  | AnalyzingApplicationState
  | ErrorApplicationState;

export const initialApplicationState: InitializingApplicationState = {
  status: 'initializing',
};
