import type { Failure, Result } from '@/core';

import type { ScenarioDefinition } from '../model/scenario-definition';
import type { ScenarioValidationError } from '../model/scenario-validation';

/** Validates the self-contained, user-selectable scenario contract. */
export function validateScenarioDefinition(
  definition: ScenarioDefinition,
): Result<ScenarioDefinition, readonly ScenarioValidationError[]> {
  const errors: ScenarioValidationError[] = [];

  if (definition.id.trim().length === 0) {
    errors.push({ code: 'invalid-scenario-id', message: 'Scenario ID must not be empty.' });
  }

  if (definition.targetEdgeId.trim().length === 0) {
    errors.push({
      code: 'invalid-scenario-target',
      message: 'A road-closure scenario must identify its target edge.',
    });
  }

  if (
    definition.presentation.label.trim().length === 0 ||
    definition.presentation.description.trim().length === 0
  ) {
    errors.push({
      code: 'invalid-scenario-presentation',
      message: 'Scenario presentation metadata requires a label and description.',
    });
  }

  return errors.length === 0
    ? { ok: true, value: definition }
    : ({ ok: false, error: Object.freeze(errors) } satisfies Failure<
        readonly ScenarioValidationError[]
      >);
}
