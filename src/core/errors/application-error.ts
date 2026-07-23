export type ApplicationErrorCode =
  | 'initialization-failed'
  | 'invalid-transition'
  | 'scenario-rejected'
  | 'simulation-failed'
  | 'analysis-failed'
  | 'insight-unavailable';

export type ApplicationError = {
  readonly code: ApplicationErrorCode;
  readonly message: string;
  readonly isRecoverable: true;
};
