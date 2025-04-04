class Result {
  // compiler hint
  ok = true;

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

  static ok(value) {
    return new Result(true, undefined, value);
  }

  static error(error) {
    return new Result(false, error);
  }

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

exports.error = Result.error;
exports.ok = Result.ok;
exports.Result = Result;
exports.t = Result.try;
