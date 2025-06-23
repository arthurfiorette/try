import assert from 'node:assert';
import { describe, test } from 'node:test';
import { Result } from '../lib/index.js';

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

describe('Result(Result)', () => {
  // tests all combinations of nested Result objects and ensure they are not inlined
  test('Result.ok(Result.ok())', () => {
    const innerResult = Result.ok('inner');
    const result = Result.ok(innerResult);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, innerResult);
  });

  test('Result.error(Result.error())', () => {
    const innerError = Result.error('inner error');
    const result = Result.error(innerError);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, innerError);
  });

  test('Result.ok(Result.error())', () => {
    const innerError = Result.error('inner error');
    const result = Result.ok(innerError);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, innerError);
  });

  test('Result.error(Result.ok())', () => {
    const innerResult = Result.ok('inner');
    const result = Result.error(innerResult);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, innerResult);
  });

  test('Result.ok(Result.ok(Result.ok()))', () => {
    const innerInnerResult = Result.ok('inner inner');
    const innerResult = Result.ok(innerInnerResult);
    const result = Result.ok(innerResult);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, innerResult);
    assert.strictEqual(result.value.ok, true);
    assert.strictEqual(result.value.value, innerInnerResult);
  });

  test('Result.error(Result.error(Result.error()))', () => {
    const innerInnerError = Result.error('inner inner error');
    const innerError = Result.error(innerInnerError);
    const result = Result.error(innerError);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, innerError);
    assert.strictEqual(result.error.ok, false);
    assert.strictEqual(result.error.error, innerInnerError);
  });

  test('Result.try(Result.ok())', () => {
    const innerResult = Result.ok('inner');
    const result = Result.try(() => innerResult);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, innerResult);
  });

  test('Result.try(Result.error())', () => {
    const innerError = Result.error('inner error');
    const result = Result.try(() => innerError);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, innerError);
  });

  test('Result.try(throw Result.ok())', () => {
    const innerResult = Result.ok('inner');
    const result = Result.try(() => {
      throw innerResult;
    });
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, innerResult);
  });

  test('Result.try(throw Result.error())', () => {
    const innerError = Result.error('inner error');
    const result = Result.try(() => {
      throw innerError;
    });
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, innerError);
  });
});
