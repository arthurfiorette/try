/**
 * Represents a failed result.
 *
 * This object can be destructured like a tuple: `[ok, error, value]`, or accessed via
 * named properties: (`ok`, `error`, `value`).
 *
 * @see {@linkcode Result}
 * @see {@linkcode ValueResult}
 */
type ErrorResult = {
  ok: false;
  error: unknown;
  value: undefined;
} & [ok: false, error: unknown, value: undefined];

/**
 * Represents a successful result.
 *
 * This object can be destructured like a tuple: `[ok, error, value]`, or accessed via
 * named properties: (`ok`, `error`, `value`).
 *
 * @see {@linkcode Result}
 * @see {@linkcode ErrorResult}
 */
type ValueResult<V> = {
  ok: true;
  error: undefined;
  value: V;
} & [ok: true, error: undefined, value: V];

/**
 * A `Result` represents the outcome of an operation, encapsulating either a success (`ok:
 * true`) or a failure (`ok: false`).
 *
 * **Even though it type has array-like properties, it is not an array and those
 * properties does not exists at runtime.**
 *
 * It can be used as both a named object and a destructurable tuple.
 */
export type Result<V> = ErrorResult | ValueResult<V>;

type WrapResult<P> =
  // checks for any
  0 extends 1 & P
    ? // intentionally omit Promise<Result<P>> return type to simplify usage
      Result<any>
    : // checks for never
      [P] extends [never]
      ? ErrorResult
      : // promise never
        P extends Promise<never>
        ? Promise<ErrorResult>
        : // unwraps any promise return type
          P extends Promise<infer U>
          ? Promise<Result<Awaited<U>>>
          : // normal return type
            Result<P>;

interface ResultConstructor {
  /**
   * Creates a failed `Result` with an error.
   *
   * @example
   *
   * ```ts
   * new Result(false, new Error('Something went wrong'));
   * ```
   */
  new (ok: false, error: unknown, value?: undefined | null): ErrorResult;

  /**
   * Creates a successful `Result` with a value.
   *
   * @example
   *
   * ```ts
   * new Result(true, undefined, 42);
   * new Result(false, new Error('Something went wrong'));
   * ```
   */
  new <V>(ok: true, error: undefined | null, value: V): ValueResult<V>;

  /**
   * Creates a successful `Result`.
   *
   * @param value The value to wrap.
   * @returns A `Result` with `ok: true`.
   */
  ok<V>(this: void, value: V): ValueResult<V>;

  /**
   * Creates a failed `Result`.
   *
   * @param error The error to wrap.
   * @returns A `Result` with `ok: false`.
   */
  error(this: void, error: unknown): ErrorResult;

  /**
   * Wraps a promise in a `Result`. The returned promise never rejects.
   *
   * @example
   *
   * ```ts
   * const [ok, error, value] = await Result.try(Promise.resolve('pass'));
   * const [ok, error, value] = await Result.try(Promise.reject('fail'));
   * ```
   *
   * @param promise A promise to wrap.
   * @returns A promise that resolves to a `Result`.
   */
  try<P extends Promise<any>>(this: void, promise: P): WrapResult<P>;

  /**
   * Executes a function and wraps its return value in a `Result`.
   *
   * If the function returns a promise, the result is awaited and wrapped. If the function
   * throws, the error is captured as a failed `Result`.
   *
   * @example
   *
   * ```ts
   * const [ok, error, value] = Result.try(syncFn, arg1, arg2);
   * const [ok, error, value] = await Result.try(asyncFn, arg1, arg2);
   *
   * const [ok, error, value] = Result.try(() => syncFn(arg1, arg2));
   * const [ok, error, value] = await Result.try(async () => await asyncFn(arg1, arg2));
   * ```
   *
   * @param fn The function to execute.
   * @param args Arguments to pass to the function.
   * @returns A `Result` or a `Promise<Result>`, depending on the function type.
   */
  try<const F extends (this: void, ...args: any) => any>(
    this: void,
    fn: F,
    ...args: Parameters<F>
  ): WrapResult<ReturnType<F>>;

  /**
   * An alias for {@linkcode Result.ok}.
   *
   * @example
   *
   * ```ts
   * const [ok, error, value] = await Result.try(myObject);
   * const [ok, error, value] = await Result.try(myArray);
   * ```
   *
   * @param value The value to wrap.
   * @returns A `Result` with `ok: true`.
   */
  try<V>(this: void, value: V): ValueResult<V>;
}

/** The main `Result` namespace for constructing and handling operation results. */
export declare const Result: ResultConstructor;

/** Shorthand for {@linkcode Result.ok}. */
export declare const ok: ResultConstructor['ok'];

/** Shorthand for {@linkcode Result.error}. */
export declare const error: ResultConstructor['error'];

/**
 * Shorthand for {@linkcode Result.try}.
 *
 * This overload supports both function and promise-based usage.
 *
 * @example
 *
 * ```ts
 * const [ok, error, value] = Result.try(syncFn, arg1, arg2);
 * const [ok, error, value] = await Result.try(asyncFn, arg1, arg2);
 *
 * const [ok, error, value] = Result.try(() => syncFn(arg1, arg2));
 * const [ok, error, value] = await Result.try(async () => await asyncFn(arg1, arg2));
 *
 * const [ok, error, value] = await Result.try(Promise.resolve('pass'));
 * const [ok, error, value] = await Result.try(Promise.reject('fail'));
 * ```
 */
export declare const t: ResultConstructor['try'];
