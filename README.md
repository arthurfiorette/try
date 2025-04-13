<p align="center">
   <b>Using this package?</b> Please consider <a href="https://github.com/arthurfiorette/try?sponsor=1" target="_blank">donating</a> to support the proposal ❤️
  <br />
  <sup>
   Help <code>try</code> grow! Star and share this amazing repository with your friends and co-workers!
  </sup>
</p>

<br />

<p align="center">
    <img src="assets/logo.svg" width="256" alt="Try safety vest logo" />
</p>

<br />

<p align="center">
  <a title="MIT license" target="_blank" href="https://github.com/arthurfiorette/try/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/arthurfiorette/try?color=FABD2F"></a>
  <a title="NPM Package" target="_blank" href="https://www.npmjs.com/package/try"><img alt="Downloads" src="https://img.shields.io/npm/dw/try?style=flat&color=FABD2F"></a>
  <a title="Bundle size" target="_blank" href="https://bundlephobia.com/package/try"><img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/try/latest?style=flat&color=FABD2F"></a>
  <a title="Last Commit" target="_blank" href="https://github.com/arthurfiorette/try/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/arthurfiorette/try?color=FABD2F"></a>
  <a title="Blazingly fast" target="_blank" href="https://twitter.com/acdlite/status/974390255393505280"><img src="https://img.shields.io/badge/blazingly-fast-FABD2F"/></a>
  <br/><a title="Codecov" target="_blank" href="https://app.codecov.io/gh/arthurfiorette/try"><img alt="Codecov" src="https://codecov.io/gh/arthurfiorette/try/graph/badge.svg?token=ky185JbytA&color=FABD2F"></a>
  
</p>

<br />
<br />

<h1>TRY</h1>

> A [336-byte](https://bundlephobia.com/package/try) spec-compliant implementation of the [`Result` class from the ECMAScript Try Operator proposal](https://github.com/arthurfiorette/proposal-try-operator).

```ts
import { t } from 'try';

const [ok, error, value] = t(JSON.parse, '{"foo": "bar"}');
const [ok, error, value] = await t(axios.get('https://arthur.place'));
```

This package is a minimal and precise reference implementation of the [`Result` class](https://github.com/arthurfiorette/proposal-try-operator#result-class) as described in the [Try Operator](https://github.com/arthurfiorette/proposal-try-operator) proposal for JavaScript.

It aims to provide a lightweight and fast runtime utility that reflects exactly how the proposed `try` operator would behave — and **will not evolve independently of the proposal**.

If you'd like to suggest changes or improvements to the behavior or API, please [open an issue on the proposal repository](https://github.com/arthurfiorette/proposal-try-operator/issues/new/choose). Once discussed and approved there, changes will be reflected in this package.

<details>

<summary>
  <h3>Table of Contents</h3>
</summary>

- [Why This Exists](#why-this-exists)
- [Usage](#usage)
  - [Wrapping a Function Call](#wrapping-a-function-call)
  - [Prefer the `t()` Alias](#prefer-the-t-alias)
  - [Prefer Using the Result Object in Multi-Try Scenarios](#prefer-using-the-result-object-in-multi-try-scenarios)
- [Works With Promises Too!](#works-with-promises-too)
- [No `Result.bind`](#no-resultbind)
- [Creating Results Manually](#creating-results-manually)
- [Learn More](#learn-more)
- [License](#license)
- [Acknowledgements](#acknowledgements)

</details>

## Why This Exists

JavaScript error handling can be verbose and inconsistent. The [Try Operator proposal](https://github.com/arthurfiorette/proposal-try-operator) introduces a new pattern that returns structured `Result` objects instead of throwing exceptions, simplifying async and sync error flows alike.

While the proposal is still in the works, this package provides a way to experiment with the new pattern in a standardized way.

This implementation provides a drop-in utility: `Result.try()` (or the shorter `t()`) to wrap expressions and handle errors in a clean, tuple-like form.

```ts
const [ok, error, value] = t(JSON.parse, '{"foo":"bar"}');

if (ok) {
  console.log(value.foo);
} else {
  console.error('Invalid JSON', error);
}
```

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
>  This form—`Result.try(() => fn())`—is verbose compared to the proposal's future `try fn()` syntax. Always prefer to use the `t()` alias for cleaner code.

<br />

### Prefer the `t()` Alias

To make code cleaner and more ergonomic while we wait for language-level syntax sugar, this package also exports `t`, a shortcut for `Result.try`.

```ts
import { Result, t } from 'try';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

// Examples
const [ok, error, value] = t(readFileSync, './config.json');
const [ok, error, value] = t(() => decoder.decode(request.body));
const [ok, error, value] = await t(axios.get('http://example.com'));
const [ok, error, value] = await t(readFile(path));
```

The `t(fn, ...args)` form is ideal: it automatically passes arguments to your function, preserves full TypeScript inference, and keeps code short and readable.

```ts
function divide(a: number, b: number) {
  return a / b;
}

const [ok, error, value] = t(divide, 10, 2); // ok: true, value: 5
const [ok, error, value] = t(divide, 10, 0); // still ok: true, value: Infinity

// ⚠️ Type error: argument type mismatch
const [ok, error, value] = t(divide, 'hello', 2); // 😅 still ok: true, value: NaN
```

<br />

### Prefer Using the Result Object in Multi-Try Scenarios

While destructuring works well for simple use cases, it can lead to awkward variable naming and clutter when handling multiple `try` results. In these cases, **it's recommended to keep the full result object and access `.ok`, `.error`, and `.value` directly** for better clarity and readability.

❌ Bad (hard to manage variable names, especially with many results):

```ts
// error handling omitted for brevity

const [ok1, error1, value1] = Result.try(() => axios.get(...));

const [ok2, error2, value2] = Result.try(() => value1.data.property);
```

✅ Better (clearer structure and easier to follow):

```ts
// error handling omitted for brevity

const response = Result.try(() => axios.get(...));

const data = Result.try(() => response.value.data.property);
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

The return value of `t()` is automatically `await`-able if the function returns a promise — no special handling needed.

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

const success = Result.ok(42);
const failure = Result.error(new Error('Something went wrong'));

// Shorthand:
const success = ok(42);
const failure = error('oops');
```

This is useful when bridging non-try-based code or mocking results.

<br />

## Learn More

To learn about the underlying proposal, including syntax goals and motivation, visit:

🔗 https://github.com/arthurfiorette/proposal-try-operator

<br />

## License

Both the project and the proposal are licensed under the [MIT](./LICENSE) license.

<br />

## Acknowledgements

Many thanks to [Szymon Wygnański](https://finalclass.net) for transferring the `try` package name on NPM to this project. Versions below `1.0.0` served a different purpose, but with his permission, the project was repurposed to host an implementation of the proposal’s `Result` class.

<br />
