export type Some<T> = {
  _tag: "Some";
  value: T;
};

export type None = {
  _tag: "None";
};

export type Option<T> = Some<T> | None;

// Fonctions utilitaires
export function SomeValue<T>(value: T): Option<T> {
  return { _tag: "Some", value };
}

export function NoneValue<T>(): Option<T> {
  return { _tag: "None" };
}

// Méthodes simplifiées
export function isSome<T>(opt: Option<T>): opt is Some<T> {
  return opt._tag === "Some";
}

export function isNone<T>(opt: Option<T>): opt is None {
  return opt._tag === "None";
}

export type Ok<T> = {
  _tag: "Ok";
  value: T;
};

export type Err<E> = {
  _tag: "Err";
  error: E;
};

export type Result<T, E> = Ok<T> | Err<E>;

export function OkValue<T, E>(value: T): Result<T, E> {
  return { _tag: "Ok", value };
}

export function ErrValue<T, E>(error: E): Result<T, E> {
  return { _tag: "Err", error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result._tag === "Ok";
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result._tag === "Err";
}
