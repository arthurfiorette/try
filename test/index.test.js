const { Result } = require('../index.js');
const { test, describe } = require('node:test');
const assert = require('node:assert');

const err = new Error('Test error');

describe('Result', () => {
  test('Result.ok()', () => {
    const result = Result.ok(42);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, 42);
  });

  test('Result.error()', () => {
    const result = Result.error(err);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, err);
  });

  test("'error' in Result", () => {
    const result = Result.ok(42);
    assert.strictEqual('error' in result, false);
  });

  test("'value' in Result", () => {
    const result = Result.error(err);
    assert.strictEqual('value' in result, false);
  });

  test('Result[Symbol.iterator]', () => {
    assert.ok(Symbol.iterator in Result.prototype);
    assert.deepStrictEqual([...Result.ok(42)], [true, undefined, 42]);
    assert.deepStrictEqual([...Result.error(err)], [false, err, undefined]);
  });

  test('Result instanceof Array', () => {
    assert.strictEqual(Array.isArray(Result.ok(42)), false);
    assert.strictEqual(Array.isArray(Result.error(err)), false);
  });

  // TODO: This behavior is not described in the proposal.
  test('PromiseLike', async () => {
    // biome-ignore lint/suspicious/noThenProperty: intentionally using a thenable
    const thenable = { then: () => Promise.resolve() };
    const result = await Result.ok(thenable);
    assert.strictEqual(result.ok, true);
    assert.deepStrictEqual(result.value, thenable);
  });

  test('typeof Result#ok', () => {
    assert.strictEqual(typeof new Result(true, null, 42).ok, 'boolean');
    assert.strictEqual(typeof new Result(false, 42).ok, 'boolean');
    //@ts-expect-error
    assert.strictEqual(typeof new Result('', 42).ok, 'boolean');
    //@ts-expect-error
    assert.strictEqual(typeof new Result(1, null, 42).ok, 'boolean');
    //@ts-expect-error
    assert.strictEqual(typeof new Result({ a: 1 }, null, { a: 1 }).ok, 'boolean');
  });
});
