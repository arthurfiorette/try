import { expectAssignable, expectNotType, expectType } from 'tsd';
import {
  type ErrorResult,
  ok,
  Result,
  type ResultConstructor,
  type ValueResult
} from '../lib/index.js';

// Same function
expectAssignable<ResultConstructor['ok']>(ok);

// never changes the return type
expectType<ValueResult<number>>(ok(42));
expectType<ValueResult<string>>(ok('42'));

// does not unwraps promise
const promiseResult = ok(Promise.resolve(42));
expectType<ValueResult<Promise<number>>>(promiseResult);
expectNotType<Promise<ValueResult<number>>>(promiseResult);

// Ensures iterator type is destructures correctly
declare const [_ok, err, val]: ValueResult<number>;
expectType<true>(_ok);
expectType<undefined>(err);
expectType<number>(val);

// Works with destructuring
declare const result: ValueResult<number>;
expectType<true>(result.ok);
expectType<undefined>(result.error);
expectType<number>(result.value);

// Ensures constructor falls back to ErrorResult type if params are incorrect
// @ts-expect-error
const res = new Result(true, new Error('Some Error'), 1);
expectType<ErrorResult>(res);
