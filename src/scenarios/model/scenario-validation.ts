export type ScenarioValidationErrorCode =
  'invalid-scenario-id' | 'invalid-scenario-target' | 'invalid-scenario-presentation';

export type ScenarioValidationError = {
  readonly code: ScenarioValidationErrorCode;
  readonly message: string;
};
