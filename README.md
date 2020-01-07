# parse-ts
_Validate json with types!_

You ever take json data from the server and want to verify it matches some interface? This library is for you!

Depends on [fp-ts](https://github.com/gcanti/fp-ts)

## Installation

`npm i -S parse-ts`

## Example

```typescript
// example interface
interface Rec {
  a: number;
  b: string;
  c: number[];
  d: boolean;
};

// Validator spec
const rec: RecordSpec<Rec> = {
  a: num,
  b: str,
  c: arrayOf(num),
  d: bool,
};

const someData = JSON.parse(`{"a": 1, "b": "hi", "c": [1], "d": false}`);

// usage
record(rec)(someData); // => Option<Rec>
```

Check out [unit tests](src/index.spec.ts) for more usage examples.

## Docs
 [Source](https://github.com/jethrolarson/parse-ts/blob/master/src/index.ts) has JSDoc with examples.

## See Also
* [io-ts](https://github.com/gcanti/io-ts) Similar to parse-ts but more powerful. Worth a look if you want more than simple JSON parsing.

