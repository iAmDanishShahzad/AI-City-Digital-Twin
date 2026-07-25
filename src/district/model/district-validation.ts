export type DistrictValidationErrorCode =
  | 'invalid-district-id'
  | 'invalid-display-metadata'
  | 'invalid-area'
  | 'duplicate-node-id'
  | 'duplicate-edge-id'
  | 'duplicate-vehicle-id'
  | 'duplicate-area-id'
  | 'duplicate-probe-id'
  | 'invalid-node-count'
  | 'invalid-edge-count'
  | 'invalid-vehicle-count'
  | 'missing-edge-node-reference'
  | 'invalid-edge-length'
  | 'invalid-edge-capacity'
  | 'invalid-closable-edge-count'
  | 'invalid-vehicle-node-reference'
  | 'invalid-vehicle-definition'
  | 'invalid-probe-node-reference'
  | 'invalid-probe-definition'
  | 'missing-alternate-route';

export type DistrictValidationError = {
  readonly code: DistrictValidationErrorCode;
  readonly message: string;
};
