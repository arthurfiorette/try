/// <reference path="./index.d.ts" />

/** @template V */
export class Result {
  /**
   * @param {boolean} ok
   * @param {unknown} [error]
   * @param {V} [value]
   */
  constructor(ok, error, value) {
    this.ok = !!ok;

    // must not set the other field to allow for
    // 'error' in result checks
    if (this.ok) {
      this.value = value;
    } else {
      this.error = error;
    }
  }

  *[Symbol.iterator]() {
    yield this.ok;
    yield this.error;
    yield this.value;
  }

  /**
   * @this void
   * @template T
   * @param {T} value
   */
  static ok(value) {
    return new Result(true, undefined, value);
  }

  /**
   * @this void
   * @param {unknown} error
   */
  static error(error) {
    return new Result(false, error);
  }

  /**
   * @this void
   * @template T
   * @param {any} result
   * @param {...any} args
   * @returns {Promise<Result<T>> | Result<T>}
   */
  static try(result, ...args) {
    // Wraps everything because `try` should never throw.
    try {
      // If syncFn() is passed directly, it throws before try() runs.
      // To prevent this, wrap it in a function and unwrap its result.
      if (typeof result === 'function') {
        result = result.apply(undefined, args);
      }

      // Promises must return a valid Promise<Result<T>>
      if (result instanceof Promise) {
        return result.then(Result.ok, Result.error);
      }

      // If the result is not a function or a Promise, we can be sure its a success
      return Result.ok(result);
    } catch (error) {
      return Result.error(error);
    }
  }
}

// Aliases
export const error = Result.error;
export const ok = Result.ok;
export const t = Result.try;
