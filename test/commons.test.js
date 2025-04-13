const { Result } = require('../index.js');
const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');

describe('Usage', () => {
  test('JSON.parse', () => {
    const result = Result.try(JSON.parse, '{"ok":true}');
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value.ok, true);

    const result2 = Result.try(JSON.parse, '{"ok":true');
    assert.strictEqual(result2.ok, false);
    assert.strictEqual(result2.error instanceof SyntaxError, true);
  });

  test('JSON.stringify', () => {
    const result = Result.try(JSON.stringify, { ok: true });
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, '{"ok":true}');

    const result2 = Result.try(
      JSON.stringify,
      new Proxy(
        {},
        {
          get: () => {
            throw new TypeError('err');
          }
        }
      )
    );
    assert.strictEqual(result2.ok, false);
    assert.strictEqual(result2.error instanceof TypeError, true);
  });

  test('fs.readFile', async () => {
    const result = await Result.try(fs.promises.readFile, 'test/commons.test.js', 'utf8');
    assert.strictEqual(result.ok, true);
    assert.strictEqual(typeof result.value, 'string');

    const result2 = await Result.try(fs.promises.readFile, 'nonexistent.txt', 'utf8');
    assert.strictEqual(result2.ok, false);
    assert.strictEqual(result2.error instanceof Error, true);
  });

  test('fs.readFileSync', () => {
    const result = Result.try(fs.readFileSync, 'test/commons.test.js', 'utf8');
    assert.strictEqual(result.ok, true);
    assert.strictEqual(typeof result.value, 'string');

    const result2 = Result.try(fs.readFileSync, 'nonexistent.txt', 'utf8');
    assert.strictEqual(result2.ok, false);
    assert.strictEqual(result2.error instanceof Error, true);
  });
});
