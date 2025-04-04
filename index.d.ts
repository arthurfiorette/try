/**
 * Error result type expressed as object
 */
export type ErrorObjectResult = { ok: false; error: unknown; value: undefined };

/**
 * Error result type expressed as tuple.
 *
 * - `error` type depends on `useUnknownInCatchVariables` tsconfig option
 */
export type ErrorTupleResult = [ok: false, error: unknown, value: undefined];

/**
 * An error result is a object that can be either destructured {@link ErrorObjectResult} or accessed by index {@link ErrorTupleResult}
 */
export type ErrorResult = ErrorObjectResult & ErrorTupleResult;

/**
 * Value result type expressed as object
 */
export type ValueObjectResult<V> = { ok: true; error: undefined; value: V };

/**
 * Value result type expressed as tuple
 */
export type ValueTupleResult<V> = [ok: true, error: undefined, value: V];

/**
 * A value result is a object that can be either destructured {@link ValueObjectResult} or accessed by index {@link ValueTupleResult}
 */
export type ValueResult<V> = ValueObjectResult<V> & ValueTupleResult<V>;

/**
 * A result is a object that can represent the result of either a failed or successful operation.
 */
export type Result<V> = ErrorResult | ValueResult<V>;

interface ResultConstructor {
  /**
   * Creates a result from a tuple
   *
   * @example
   *
   * new Result(true, undefined, 42)
   * new Result(false, new Error('Something went wrong'))
   */
  new <V>(...args: ValueTupleResult<V> | ErrorTupleResult): Result<V>;

  /**
   * Creates a result for a successful operation
   */
  ok<V>(this: void, value: V): Result<V>;

  /**
   * Creates a result for a failed operation
   */
  error<V>(this: void, error: unknown): Result<V>;

  /**
   * Wraps a promise into a {@linkcode Result}.
   *
   * The resulting promise never rejects.
   *
   * @example
   *
   * const [ok, error, value] = await Result.try(Promise.resolve('pass'))
   * const [ok, error, value] = await Result.try(new Promise((rej) => rej('hello')))
   */
  try<P extends Promise<R>, R>(this: void, promise: P): Promise<Result<R>>;

  /**
   * Runs a function and wraps the result into a {@linkcode Result}.
   *
   * @example
   *
   * const [ok, error, value] = Result.try(func, arg1, arg2)
   * const [ok, error, value] = await Result.try(asyncFunc, arg1, arg2)
   * const [ok, error, value] = await Result.try(async (arg) => arg, 'pass')
   */
  try<F extends (this: void, ...args: A) => R, A extends any[], R>(
    this: void,
    fn: F,
    ...args: Parameters<F>
  ): ReturnType<F> extends Promise<infer R> ? Promise<Result<R>> : Result<ReturnType<F>>;
}

/**
 * A result is a object that can represent the result of either a failed or successful operation.
 */
export declare const Result: ResultConstructor;

/**
 * Creates a result for a successful operation
 */
export declare const ok: ResultConstructor['ok'];

/**
 * Creates a result for a failed operation
 */
export declare const error: ResultConstructor['error'];

/**
 * Runs a function and wraps the result into a {@linkcode Result} or wraps a promise into a {@linkcode Result}.
 *
 * @example
 *
 * const [ok, error, value] = Result.try(func, arg1, arg2)
 * const [ok, error, value] = await Result.try(asyncFunc, arg1, arg2)
 * const [ok, error, value] = await Result.try(async (arg) => arg, 'pass')
 *
 * const [ok, error, value] = await Result.try(Promise.resolve('pass'))
 * const [ok, error, value] = await Result.try(new Promise((rej) => rej('hello')))
 */
export declare const t: ResultConstructor['try'];
