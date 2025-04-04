const { Result, ok, error, t } = require('../index.js');
const { test, describe } = require('node:test');
const assert = require('node:assert');

describe('exports', () => {
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

  test('only 4 exports', () => {
    const keys = Object.keys(require('../index.js'));
    assert.strictEqual(keys.length, 4);
    assert.deepStrictEqual(keys.sort(), ['Result', 'error', 'ok', 't']);
  });
});
