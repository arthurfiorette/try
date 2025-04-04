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
    return new Result(true, void 0, value);
  }

  static error(error) {
    return new Result(false, error, void 0);
  }

  static try(result, ...args) {
    // Wraps everything because `try` should never throw.
    try {
      // try(syncFn()) would throw before try() gets executed, in those cases wrapping
      // the actual value in a function is needed. In that case, the function must
      // be unwrapped to get the value.
      if (typeof result === 'function') {
        result = result.apply(undefined, args);
      }

      // Thenables must return a Promise<Result<T>>
      if (result instanceof Promise) {
        return result.then(this.ok, this.error);
      }

      // If the result is not a function or a Promise, we can be sure its a success
      return this.ok(result);
    } catch (error) {
      return this.error(error);
    }
  }
}

exports.error = Result.error;
exports.ok = Result.ok;
exports.Result = Result;
exports.t = Result.try;
