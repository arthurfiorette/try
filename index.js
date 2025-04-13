/** @template V */
class Result {
  ok = true;

  /**
   * @param {boolean} ok
   * @param {unknown} [error]
   * @param {V} [value]
   */
  constructor(ok, error, value) {
    this.ok = !!ok;

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
   * @template T
   * @param {T} value
   */
  static ok(value) {
    return new Result(true, undefined, value);
  }

  /** @param {unknown} error */
  static error(error) {
    return new Result(false, error);
  }

  /**
   * @template T
   * @param {any} result
   * @param {...any} args
   * @returns {Promise<Result<T>> | Result<T>}
   */
  static try(result, ...args) {
    try {
      if (typeof result === 'function') {
        result = result.apply(undefined, args);
      }

      if (result instanceof Promise) {
        return result.then(Result.ok, Result.error);
      }

      return Result.ok(result);
    } catch (error) {
      return Result.error(error);
    }
  }
}

exports.error = Result.error;
exports.ok = Result.ok;
exports.Result = Result;
exports.t = Result.try;
