/** @type {import('./index.d.ts').ResultConstructor} */
class Result {
  constructor(ok, error, value) {
    this.ok = ok;

    // conditionally assign so `in` operator works
    if (ok) {
      this.value = value;
    } else {
      this.error = error;
    }
  }

  try() {}
}

// class Result {

//   *[Symbol.iterator]() {
//     yield this.ok
//     yield this.error
//     yield this.value
//   }

//   static ok(value) {
//     return new Result(true, undefined, value)
//   }

//   static error(error) {
//     return new Result(false, error, undefined)
//   }

//   static try(result, ...args) {
//     // Wraps everything because `try` should never throw.
//     try {
//       // try(syncFn()) would throw before try() gets executed, in those cases wrapping
//       // the actual value in a function is needed. In that case, the function must
//       // be unwrapped to get the value.
//       if (typeof result === "function") {
//         result = result.apply(undefined, args)
//       }

//       // Thenables must return a Promise<Result<T>>
//       if (typeof result === "object" && typeof result.then === "function") {
//         return result.then(Result.ok, Result.error)
//       }

//       // If the result is not a function or a Promise, we can be sure its a success
//       return Result.ok(result)
//     } catch (error) {
//       return Result.error(error)
//     }
//   }
// }
