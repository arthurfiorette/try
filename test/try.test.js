const { Result } = require('../index.js');
const { test, describe } = require('node:test');
const assert = require('node:assert');

function syncOk() {
  return 'ok';
}

function syncErr() {
  throw 'err';
}

async function asyncResolve() {
  return 'resolve';
}

async function asyncReject() {
  throw 'reject';
}

function syncResolve() {
  return asyncResolve();
}

function syncReject() {
  return asyncReject();
}

describe('Result.try(fn)', () => {
  test('syncOk()', () => {
    const result = Result.try(syncOk);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, 'ok');
  });

  test('syncErr()', () => {
    const result = Result.try(syncErr);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, 'err');
  });

  test('asyncResolve()', async () => {
    const result = await Result.try(asyncResolve);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, 'resolve');
  });

  test('asyncReject()', async () => {
    const result = await Result.try(asyncReject);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, 'reject');
  });

  test('syncResolve()', async () => {
    const result = await Result.try(syncResolve);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, 'resolve');
  });

  test('syncReject()', async () => {
    const result = await Result.try(syncReject);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, 'reject');
  });
});

describe('Result.try(fn, ...args)', () => {
  function syncArgs(a = 0, b = 0) {
    return a + b;
  }

  function syncErrArgs(e = '', r = '', r2 = '') {
    throw e + r + r2;
  }

  async function asyncResolveArgs(a = '', b = '') {
    return a + b;
  }

  async function asyncRejectArgs(err = new Error('reject')) {
    throw err;
  }

  test('syncArgs(1, 2)', () => {
    const result = Result.try(syncArgs, 1, 2);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, 3);
  });

  test('syncErrArgs()', () => {
    const result = Result.try(syncErrArgs, 'ar', 'th', 'ur');
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, 'arthur');
  });

  test('asyncResolveArgs(1, 2)', async () => {
    const result = await Result.try(asyncResolveArgs, 'art', 'hur');
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, 'arthur');
  });

  test('asyncRejectArgs()', async () => {
    const err = new Error('123');
    const result = await Result.try(asyncRejectArgs, err);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, err);
  });
});

describe('Result.try(Promise)', () => {
  test('Promise.resolve()', async () => {
    const result = await Result.try(Promise.resolve(42));
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.value, 42);
  });

  test('Promise.reject()', async () => {
    const err = new Error('Test error');
    const result = await Result.try(Promise.reject(err));
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.error, err);
  });

  test('Promise.resolve(Function)', async () => {
    const result = await Result.try(Promise.resolve(() => {}));

    assert.strictEqual(result.ok, true);
    assert.strictEqual(typeof result.value, 'function');
  });

  test('Promise.reject(Function)', async () => {
    const result = await Result.try(Promise.reject(() => {}));

    assert.strictEqual(result.ok, false);
    assert.strictEqual(typeof result.error, 'function');
  });
});
