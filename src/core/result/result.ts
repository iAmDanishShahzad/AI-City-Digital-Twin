export type Success<Value> = {
  readonly ok: true;
  readonly value: Value;
};

export type Failure<Error> = {
  readonly ok: false;
  readonly error: Error;
};

export type Result<Value, Error> = Success<Value> | Failure<Error>;
