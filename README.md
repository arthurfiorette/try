<p align="center">
   <b>Using this package?</b> Please consider <a href="https://github.com/arthurfiorette/try?sponsor=1" target="_blank">donating</a> to support the proposal ❤️
  <br />
  <sup>
   Help <code>try</code> grow! Star and share this amazing repository with your friends and co-workers!
  </sup>
</p>

<p align="center">
  <a title="MIT license" target="_blank" href="https://github.com/arthurfiorette/try/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/arthurfiorette/try"></a>
  <a title="NPM Package" target="_blank" href="https://www.npmjs.com/package/try"><img alt="Downloads" src="https://img.shields.io/npm/dw/try?style=flat"></a>
  <a title="Bundle size" target="_blank" href="https://bundlephobia.com/package/try"><img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/try/latest?style=flat"></a>
  <a title="Last Commit" target="_blank" href="https://github.com/arthurfiorette/try/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/arthurfiorette/try"></a>
  <a title="Codecov" target="_blank" href="https://app.codecov.io/gh/arthurfiorette/try"><img alt="Codecov" src="https://codecov.io/gh/arthurfiorette/try/graph/badge.svg?token=ky185JbytA"></a>
  
</p>

<br />

<h1>TRY</h1>

> A [373-byte](https://bundlephobia.com/package/try) spec-compliant runtime-only implementation of the [`Result` class from the ECMAScript Try Operator proposal](https://github.com/arthurfiorette/proposal-try-operator).

```ts
import { t } from 'try';

const [ok, error, value] = t(() => JSON.parse('{"foo": "bar"}'));
const [ok, error, value] = await t(axios.get('https://arthur.place'));
```

<br />

This package is a minimal and precise reference implementation of the [`Result` class](https://github.com/arthurfiorette/proposal-try-operator#result-class) as described in the [Try Operator](https://github.com/arthurfiorette/proposal-try-operator) proposal for JavaScript.

It aims to provide a lightweight and fast runtime utility that reflects exactly how the proposed `try` operator would behave, and **will not evolve independently of the proposal**.

If you'd like to suggest changes or improvements to the behavior or API, please [open an issue on the proposal repository](https://github.com/arthurfiorette/proposal-try-operator/issues/new/choose). Once discussed and approved there, changes will be reflected in this package.

<br />

- [Why This Exists](#why-this-exists)
- [Usage](#usage)
  - [Wrapping a Function Call](#wrapping-a-function-call)
  - [`t()` alias](#t-alias)
  - [Prefer Using the Result Object in Multi-Try Scenarios](#prefer-using-the-result-object-in-multi-try-scenarios)
- [Works With Promises Too!](#works-with-promises-too)
- [No `Result.bind`](#no-resultbind)
- [Creating Results Manually](#creating-results-manually)
- [Learn More](#learn-more)
- [Acknowledgements](#acknowledgements)
- [License](#license)

<br />

```ts
import { Result, ok, error, t } from 'try';

// Synchronous function call
const [ok1, err1, val1] = t(JSON.parse, '{"foo":"bar"}');

// Arrow function context
const [ok2, err2, val2] = t(() => decoder.decode(buffer));

// Promise call
const [ok3, err3, val3] = await t(fetch, 'https://api.example.com');

// Promise-safe call (safely catches both sync and async errors)
const [ok4, err4, val4] = await t(() => readFile('./config.json'));

// Argument passthrough
const [ok5, err5, val5] = t((a, b) => a + b, 2, 3);

// Keep full result object for readability
const result = await t(fetch, 'https://arthur.place');
if (result.ok) console.log(await result.value.text());

// Manual success and error results
const success = ok(42);
const failure = error(new Error('nope'));

// Manual Result creation via class
const successObj = Result.ok('done');
const failureObj = Result.error('fail');
```

<br />

## Why This Exists

JavaScript error handling can be verbose and inconsistent. The [Try Operator proposal](https://github.com/arthurfiorette/proposal-try-operator) introduces a new pattern that returns structured `Result` objects instead of throwing exceptions, simplifying async and sync error flows alike.

While the proposal is still in the works, this package provides a way to experiment with the new pattern in a standardized way.

This package provides a drop-in utility: `Result.try()` (or the shorter `t()`) to wrap expressions and handle errors in a clean, tuple-like form.

```ts
const [ok, error, value] = t(JSON.parse, '{"foo":"bar"}');

if (ok) {
  console.log(value.foo);
} else {
  console.error('Invalid JSON', error);
}
```

> You can destructure the result into `[ok, error, value]`, or access `.ok`, `.error`, and `.value` directly depending on your use case.

<br />

## Usage

All methods are documented via TSDoc, so your editor will guide you with full type support and autocomplete.

### Wrapping a Function Call

Use `Result.try()` or `t()` to wrap a potentially failing operation:

```ts
const [ok, error, value] = Result.try(() => JSON.parse(request.body));

if (ok) {
  console.log(`Hello ${value.name}`);
} else {
  console.error(`Invalid JSON!`);
}
```

> [!NOTE]  
>  `Result.try(() => fn())` is verbose compared to the proposal's future `try fn()` syntax. Always prefer to use the `t()` alias for cleaner code.

<br />

### `t()` alias

To make code cleaner and more ergonomic while we wait for language-level syntax sugar, this package also exports `t`, a shortcut for `Result.try`.

```ts
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

// Example (this is void)
const [ok, error, value] = t(readFileSync, './config.json');
// If `this` matters in your context
const [ok, error, value] = t(() => decoder.decode(request.body));
// Promises don't need wrapping
const [ok, error, value] = await t(axios.get('http://example.com'));
// Safer way even for promises (catches sync errors before returning a promise)
const [ok, error, value] = await t(readFile, path);
```

The `t(fn, ...args)` form is ideal: it automatically passes arguments to your function, preserves full TypeScript inference, and keeps code short and readable.

```ts
function divide(a: number, b: number) {
  return a / b;
}

const [ok, error, value] = t(divide, 10, 2);
// ok: true, value: 5
```

<br />

### Prefer Using the Result Object in Multi-Try Scenarios

While destructuring works well for simple use cases, it can lead to awkward variable naming and clutter when handling multiple `try` results. In these cases, **it's recommended to keep the full result object and access `.ok`, `.error`, and `.value` directly** for better clarity and readability.

❌ Bad (managing variable names becomes cumbersome):

```ts
// error handling omitted for brevity
const [ok1, error1, value1] = Result.try(() => axios.get(...));
const [ok2, error2, value2] = Result.try(() => value1.data.property);
```

✅ Better (clearer structure and easier to follow):

```ts
// error handling omitted for brevity
const response = await Result.try(fetch('https://arthur.place'));
const data = await Result.try(() => response.value.text()));
```

Using the result object directly avoids unnecessary boilerplate and naming inconsistencies, especially in nested or sequential operations. It's a cleaner, more scalable pattern that mirrors real-world error handling flows.

<br />

## Works With Promises Too!

You can pass a `Promise` directly and get a `Result`-wrapped version:

```ts
const [ok, error, value] = await t(
  fs.promises.readFile('./config.json')
);

if (ok) {
  const config = JSON.parse(value.toString());
} else {
  console.error('Failed to read file', error);
}
```

The return value of `t()` is automatically `await`-able if the function returns a promise, no extra handling required.

<br />

## No `Result.bind`

This implementation **will never provide a `Result.bind()`** (like `util.promisify`) because the Try Operator follows the [Caller’s Approach](https://github.com/arthurfiorette/proposal-try-operator/tree/main#callers-approach) model.

That means **error handling belongs to the calling context**, not the function itself. Wrapping a function with `bind()` would push error encapsulation into the callee, breaking that principle.

**In short:** the caller chooses to wrap a function call in `Result.try`, not the function author.

<br />

## Creating Results Manually

You can also create `Result` objects directly:

```ts
import { Result, ok, error } from 'try';

// With full Result class
const res1 = Result.ok('done');
const res2 = Result.error('fail');

// Shorthand
const okRes = ok(42);
const errRes = error('oops');
```

This is useful when bridging non-try-based code or mocking results.

<br />

## Learn More

To learn about the underlying proposal, including syntax goals and motivation, visit:

🔗 https://github.com/arthurfiorette/proposal-try-operator

<br />

## Acknowledgements

Many thanks to [Szymon Wygnański](https://finalclass.net) for transferring the `try` package name on NPM to this project. Versions below `1.0.0` served a different purpose, but with his permission, the project was repurposed to host an implementation of the proposal’s `Result` class.

<br />

## License

Both the project and the proposal are licensed under the [MIT](./LICENSE) license.

<br />
