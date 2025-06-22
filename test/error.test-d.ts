import { expectAssignable, expectType } from 'tsd';
import { type ErrorResult, error, type ResultConstructor } from '../lib/index.js';

// Same function
expectAssignable<ResultConstructor['error']>(error);

// never changes the return type
expectType<ErrorResult>(error(42));
expectType<ErrorResult>(error('42'));
expectType<ErrorResult>(error(new Error('42')));

// Ensures iterator type is destructures correctly
declare const [ok, err, val]: ErrorResult;
expectType<false>(ok);
expectType<unknown>(err);
expectType<undefined>(val);

// Works with destructuring
declare const result: ErrorResult;
expectType<false>(result.ok);
expectType<unknown>(result.error);
expectType<undefined>(result.value);
