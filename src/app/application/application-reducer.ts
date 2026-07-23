import type { AnalyticsSummary } from '@/analytics';
import type { ApplicationError } from '@/core';
import type { Insight } from '@/insights';
import type { ScenarioDefinition } from '@/scenarios';
import type { SimulationSnapshot } from '@/simulation';

import type {
  ApplicationSession,
  ApplicationState,
  RecoverableApplicationState,
} from './application-state';

export type ApplicationAction =
  | { readonly type: 'initialize'; readonly session: ApplicationSession }
  | { readonly type: 'select-scenario'; readonly scenario: ScenarioDefinition }
  | { readonly type: 'start-simulation' }
  | { readonly type: 'update-snapshot'; readonly snapshot: SimulationSnapshot }
  | { readonly type: 'start-analysis' }
  | {
      readonly type: 'complete-analysis';
      readonly analytics: AnalyticsSummary;
      readonly insight: Insight;
    }
  | { readonly type: 'reset'; readonly session: ApplicationSession }
  | { readonly type: 'report-error'; readonly error: ApplicationError }
  | { readonly type: 'recover' };

function toReadyState(session: ApplicationSession) {
  return {
    ...session,
    status: 'ready' as const,
  };
}

function isRecoverableState(state: ApplicationState): state is RecoverableApplicationState {
  return state.status !== 'initializing' && state.status !== 'error';
}

export function applicationReducer(
  state: ApplicationState,
  action: ApplicationAction,
): ApplicationState {
  switch (action.type) {
    case 'initialize':
      if (state.status !== 'initializing' && state.status !== 'error') {
        return state;
      }

      return toReadyState(action.session);

    case 'select-scenario':
      if (state.status !== 'ready') {
        return state;
      }

      return {
        ...state,
        status: 'applying-scenario',
        selectedScenario: action.scenario,
      };

    case 'start-simulation':
      if (state.status !== 'applying-scenario') {
        return state;
      }

      return {
        ...state,
        status: 'simulating',
      };

    case 'update-snapshot':
      if (state.status !== 'simulating') {
        return state;
      }

      return {
        ...state,
        currentSnapshot: action.snapshot,
      };

    case 'start-analysis':
      if (state.status !== 'simulating') {
        return state;
      }

      return {
        ...state,
        status: 'analyzing',
      };

    case 'complete-analysis':
      if (state.status !== 'analyzing') {
        return state;
      }

      return toReadyState({
        district: state.district,
        baselineSnapshot: state.baselineSnapshot,
        currentSnapshot: state.currentSnapshot,
        analytics: action.analytics,
        insight: action.insight,
      });

    case 'reset':
      return toReadyState(action.session);

    case 'report-error':
      return {
        status: 'error',
        error: action.error,
        lastValidState: isRecoverableState(state) ? state : null,
      };

    case 'recover':
      if (state.status !== 'error') {
        return state;
      }

      return state.lastValidState ?? { status: 'initializing' };
  }
}
