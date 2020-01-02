import {record, str, num, bool, nil, exactly, arrayOf, RecordSpec} from './index';
import { getOrElse } from 'fp-ts/lib/Option';

describe('str', () => {
    const failString = 'fail';
    it('passes for normal string', () => {
        expect(getOrElse(() => failString)(str('a'))).toBe('a');
    });
    it('passes for empty string', () => {
        expect(getOrElse(() => failString)(str(''))).toBe('');
    });
    it('fails for non-string', () => {
        expect(getOrElse(() => failString)(str(1))).toBe(failString);
    });
});

describe('num', () => {
    const failNum = -1;
    it('passes for normal number', () => {
        expect(getOrElse(() => failNum)(num(1))).toBe(1);
    });
    it('passes for 0', () => {
        expect(getOrElse(() => failNum)(num(0))).toBe(0);
    });
    it('passes for NaN', () => {
        expect(getOrElse(() => failNum)(num(NaN))).toBe(NaN);
    });
    it('fails for non-string', () => {
        expect(getOrElse(() => failNum)(num('a'))).toBe(failNum);
    });
});

describe('bool', () => {
    it('passes for true', () => {
        expect(getOrElse(() => false)(bool(true))).toBe(true);
    });
    it('passes for false', () => {
        expect(getOrElse(() => true)(bool(false))).toBe(false);
    });
    it('fails for string', () => {
        expect(getOrElse(() => false)(bool('hi'))).toBe(false);
    });
    it('fails for null', () => {
        expect(getOrElse(() => false)(bool(null))).toBe(false);
    });
    it('fails for undefined', () => {
        expect(getOrElse(() => false)(bool(undefined))).toBe(false);
    });
    it('fails for 0', () => {
        expect(getOrElse(() => false)(bool(0))).toBe(false);
    });
    it('fails for empty-string', () => {
        expect(getOrElse(() => false)(bool(''))).toBe(false);
    });
});

describe('nil', () => {
    it('passes for null', () => {
        expect(getOrElse((): null | true => true)(nil(null))).toBe(null);
    });
    it('fails otherwise', () => {
        expect(getOrElse((): null | true => true)(nil(undefined))).toEqual(true);
        expect(getOrElse((): null | true => true)(nil(1))).toBe(true);
    });
});

describe('exactly', () => {
    it('passes for same value', () => {
        expect(getOrElse(() => 'fail')(exactly('pass')('pass'))).toBe('pass');
    });
    it('fails otherwise', () => {
        expect(getOrElse(() => 'fail')(exactly('pass')('Pass'))).toBe('fail');
    });
});

describe('arrayOf', () => {
    const failArr = [0];
    it('fails for non-array', () => {
        expect(getOrElse(() => failArr)(arrayOf(num)(1))).toEqual(failArr);
    });
    it('fails for internal type mismatch', () => {
        expect(getOrElse(() => failArr)(arrayOf(num)(['a', 1]))).toEqual(failArr);
    });
    it('pass for empty', () => {
        expect(getOrElse(() => failArr)(arrayOf(num)([]))).toEqual([]);
    });
    it('pass for match', () => {
        expect(getOrElse(() => failArr)(arrayOf(num)([1, 2]))).toEqual([1, 2]);
    });
});

describe('record', () => {
    interface Rec{
        num: number;
        str: string;
        arr: number[];
        bool: boolean;
    };
    const rec: RecordSpec<Rec> = {
        num: num,
        str: str,
        arr: arrayOf(num),
        bool: bool,
    };
    const checkRec = getOrElse((): Rec | null => null);
    it('fails for not object', () => {
        expect(checkRec(record(rec)(null))).toBe(null);
    });
    it('fails for empty', () => {
        expect(checkRec(record(rec)({}))).toBe(null);
    });
    it('fails for partial', () => {
        expect(checkRec(record(rec)({num: 1}))).toBe(null);
    });
    it('pass for full', () => {
        const v = {num: 1, str: 'hi', arr: [1], bool: false};
        expect(checkRec(record(rec)(v))).toEqual(v);
    });
});