import fs from 'node:fs';
import { expectAssignable, expectError, expectType } from 'tsd';
import {
  type ErrorResult,
  type Result,
  type ResultConstructor,
  type ValueResult,
  t
} from '../lib/index.js';

// Same function
expectAssignable<ResultConstructor['try']>(t);

// Keeps any when no type is provided
expectType<Result<any>>(t(() => JSON.parse('{"foo": "bar"}')));
expectType<Result<any>>(t(JSON.parse, '{"foo": "bar"}'));
expectType<Promise<Result<any>>>(t(async () => JSON.parse('{"foo": "bar"}')));

// Supports promise overloads
expectType<Promise<Result<string>>>(t(fs.promises.readFile('package.json', 'utf-8')));
expectType<Promise<Result<string>>>(t(() => fs.promises.readFile('package.json', 'utf-8')));
expectType<Promise<Result<string>>>(t(async () => fs.promises.readFile('package.json', 'utf-8')));

// readFileSync also works
expectType<Result<string>>(t(() => fs.readFileSync('package.json', 'utf-8')));
expectType<Promise<Result<string>>>(t(async () => fs.readFileSync('package.json', 'utf-8')));

// Ensures iterator type is destructures correctly
declare const [_ok, err, val]: Result<number>;

expectType<boolean>(_ok);
expectType<unknown | undefined>(err);
expectType<undefined | number>(val);

if (_ok) {
  expectType<true>(_ok);
  expectType<undefined>(err);
  expectType<number>(val);
} else {
  expectType<false>(_ok);
  expectType<unknown>(err);
  expectType<undefined>(val);
}

// Works with destructuring
declare const result: Result<number>;
expectType<boolean>(result.ok);
expectType<unknown | undefined>(result.error);
expectType<undefined | number>(result.value);

if (result.ok) {
  expectType<true>(result.ok);
  expectType<undefined>(result.error);
  expectType<number>(result.value);
} else {
  expectType<false>(result.ok);
  expectType<unknown>(result.error);
  expectType<undefined>(result.value);
}

// Synchronous throwing function
expectType<ErrorResult>(
  t(() => {
    throw new Error('sync error');
  })
);

// Asynchronous throwing function
expectType<Promise<ErrorResult>>(
  t(async () => {
    throw new Error('async error');
  })
);

// Null and undefined handling
expectType<Result<null>>(t(() => null));
expectType<Result<undefined>>(t(() => undefined));

// Wrapping primitive values
expectType<ValueResult<boolean>>(t(true));
expectType<ValueResult<number>>(t(42));
expectType<ValueResult<string>>(t('text'));

// Passing a function that doesn't throw
expectType<Result<number>>(t(Math.random));

// Function with args
function multiply(a: number, b: number) {
  return a * b;
}
expectType<Result<number>>(t(multiply, 2, 3));

async function asyncString(): Promise<string> {
  return 'async result';
}
expectType<Promise<Result<string>>>(t(asyncString));

// Function returning a promise that resolves to number
function promiseNumber() {
  return Promise.resolve(42);
}
expectType<Promise<Result<number>>>(t(promiseNumber));

// Wrapping a manually created Promise
expectType<Promise<Result<string>>>(t(new Promise<string>((resolve) => resolve('ok'))));

t(() => Promise.resolve('chain')).then((res) => {
  expectType<Result<string>>(res);
});

t(Promise.resolve('chain')).then((res) => {
  expectType<Result<string>>(res);
});

// Does not unwraps thenables
expectType<Result<{ then(): boolean }>>(
  t(() => ({
    // biome-ignore lint/suspicious/noThenProperty: This is a test
    then(): boolean {
      return true;
    }
  }))
);
expectType<Result<{ then(): never }>>(
  t(() => ({
    // biome-ignore lint/suspicious/noThenProperty: This is a test
    then() {
      throw new Error('error');
    }
  }))
);

// Breaks with instance methods
function instanceMethod(this: { foo: number }, param: number) {
  return this.foo + param;
}
expectError(t(instanceMethod, 123));
