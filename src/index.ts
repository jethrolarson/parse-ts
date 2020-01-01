import {some, none, Option, isSome, map} from 'fp-ts/lib/Option';
import {filterMap} from 'fp-ts/lib/Array';
import {flow} from 'fp-ts/lib/function';

// values: string, number, null, false, true

export const str = (v: unknown): Option<string> =>
    typeof v === 'string' ? some(v) : none;

export const num = (v: unknown): Option<number> =>
    typeof v === 'number' ? some(v) : none;

export const exactly = <T>(val: T) => (v: any): Option<T> =>
    Object.is(v, val) ? some(v) : none;

export const nil: Validator<null> = exactly(null);

export const bool = (v: unknown): Option<boolean> =>
    typeof v === 'boolean' ? some(v) : none;

export const F = exactly(false);

export const T = exactly(true);

// collections: array, object

export type Validator<U = never> = (x: unknown) => Option<U>;

export const arrayOf = <T>(childValidator: Validator<T>) => (v: unknown): Option<T[]> =>{
    if(Array.isArray(v)){
        const cleaned = filterMap(childValidator)(v);
        if(cleaned.length === v.length) {
            return some(v);
        }
    }
    return none;
};

export type RecordValidator<T> = {[K in keyof T]: Validator<T[K]>};

type ValidatedRecord<T> = {[K in keyof T]: Option<T[K]>};

const isPlainObject = (obj: unknown): obj is Record<string, any> =>
	Object.prototype.toString.call(obj) === '[object Object]';

const hasOwnProperty = (k: string, v: Record<string, any>): v is Record<typeof k, unknown> =>
    Object.prototype.hasOwnProperty.call(v, k);

const validateObj = <T>(mapping: RecordValidator<T>) => (v: {}): ValidatedRecord<T> => {
    const part: Partial<ValidatedRecord<T>> = {};
    for (const k in mapping){
        part[k] = hasOwnProperty(k, v) ? mapping[k](v[k]) : none;
    }
    // Force after going over every key
    return part as ValidatedRecord<T>;
}

const extractValidatedRecord = <T>(rec: ValidatedRecord<T>): Option<T> => {
    const part: Partial<T> = {};
    for (const k in rec){
        if(isSome(rec[k])){
             map((a: T[typeof k]) => {
                part[k] = a;
            })(rec[k]);
        } else {
            return none;
        }
    }
    return some(part as T);
}

export const record = <T>(mapping: RecordValidator<T>) => (v: unknown): Option<T> => {
    if(!isPlainObject(v)) return none;
    return flow(
        validateObj(mapping),
        extractValidatedRecord
    )(v);
};