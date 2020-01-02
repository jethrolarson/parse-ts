// # parse-ts
// Type-safe parsing of JSON-compatible runtime data.
import {some, none, Option, isSome, map} from 'fp-ts/lib/Option';
import {filterMap} from 'fp-ts/lib/Array';
import {flow} from 'fp-ts/lib/function';

// ### Validator type
// Type of functions that validate `unknown` data. Returns Option from 'fp-ts'.
export type Validator<U = never> = (x: unknown) => Option<U>;

// ### str
// Validate string
export const str: Validator<string> = v =>
    typeof v === 'string' ? some(v) : none;

// ### num
// Validate number
export const num: Validator<number> = v =>
    typeof v === 'number' ? some(v) : none;

// ### exactly
// Validate that value matches the passed one. Uses `Object.is`
export const exactly = <T>(val: T) => (v: any): Option<T> =>
    Object.is(v, val) ? some(v) : none;

// ### nil
// Validate that value is null
export const nil: Validator<null> = exactly(null);

// ### bool
// Validate boolean
export const bool: Validator<boolean> = v =>
    typeof v === 'boolean' ? some(v) : none;

// ### F
// Validate that value is false
export const F: Validator<false> = exactly(false);

// ### T
// Validate the value is true
export const T: Validator<true> = exactly(true);

// ### arrayOf
// Validates that all values of a potential array match the passed validator
export const arrayOf = <T>(childValidator: Validator<T>) => (v: unknown): Option<T[]> =>{
    if(Array.isArray(v)){
        const cleaned = filterMap(childValidator)(v);
        if(cleaned.length === v.length) {
            return some(v);
        }
    }
    return none;
};

// ### RecordSpec type
// A mapping of object keys to validators for it's values.
// Pass the desired interface as the generic to ensure validator is correct
export type RecordSpec<T = never> = {[K in keyof T]: Validator<T[K]>};

type ValidatedRecord<T> = {[K in keyof T]: Option<T[K]>};

const isPlainObject = (obj: unknown): obj is Record<string, any> =>
	Object.prototype.toString.call(obj) === '[object Object]';

const hasOwnProperty = (k: string, v: Record<string, any>): v is Record<typeof k, unknown> =>
    Object.prototype.hasOwnProperty.call(v, k);

const validateObj = <T>(mapping: RecordSpec<T>) => (v: {}): ValidatedRecord<T> => {
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

// ### record: `RecordSpec<T> -> Validator<T>`
// Validate that a potential object matches the passed spec. 
export const record = <T>(mapping: RecordSpec<T>) => (v: unknown): Option<T> => {
    if(!isPlainObject(v)) return none;
    return flow(
        validateObj(mapping),
        extractValidatedRecord
    )(v);
};