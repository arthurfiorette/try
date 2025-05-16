import { expectError, expectNotType, expectType } from 'tsd';
import { type ErrorResult, Result, type ValueResult } from '../lib/index.js';

// Always error types
expectType<ErrorResult>(new Result(false, new Error('str')));
expectType<ErrorResult>(new Result(false, 123));
expectType<ErrorResult>(new Result(false, 'str'));

// Always result types
expectType<ValueResult<number>>(new Result(true, undefined, 123));
expectType<ValueResult<string>>(new Result(true, undefined, 'str'));

// Does not unwraps promise
const promiseResult = new Result(true, undefined, Promise.resolve(123));
expectType<ValueResult<Promise<number>>>(promiseResult);
expectNotType<Promise<ValueResult<number>>>(promiseResult);

// Does not uses result when when ErrorResult
expectError(new Result(false, new Error('str'), 123));
expectError(new Result(false, 123, 'str'));

// Does not uses error when when ValueResult
expectError(new Result(true, 123, new Error('str')));
expectError(new Result(true, 'str', new Error('str')));
