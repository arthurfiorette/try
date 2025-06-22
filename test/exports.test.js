import assert from 'node:assert';
import { describe, test } from 'node:test';
import { error, ok, Result, t } from '../lib/index.js';

describe('export {}', () => {
  test('Result.ok === ok', () => {
    assert.strictEqual(Result.ok, ok);
  });

  test('Result.error === error', () => {
    assert.strictEqual(Result.error, error);
  });

  test('Result.try === t', () => {
    assert.strictEqual(Result.try, t);
  });

  test('Result is a class', () => {
    assert.strictEqual(typeof Result, 'function');
    assert.strictEqual(Result.prototype.constructor, Result);
  });

  test('only 4 exports', async () => {
    const keys = Object.keys(await import('../lib/index.js'));
    assert.strictEqual(keys.length, 4);
    assert.deepStrictEqual(keys.sort(), ['Result', 'error', 'ok', 't']);
  });
});
