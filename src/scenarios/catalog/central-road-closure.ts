import type { RoadClosureScenarioDefinition } from '../model/scenario-definition';

/** The only selectable disruption supported by the MVP district. */
export const centralRoadClosureScenario = Object.freeze({
  id: 'central-road-closure',
  kind: 'road-closure',
  targetEdgeId: 'civic-square-to-market',
  presentation: Object.freeze({
    label: 'Close Civic Square to Market',
    description: 'Close the primary corridor segment between Civic Square and Market.',
  }),
} satisfies RoadClosureScenarioDefinition);
