# parse-ts
_Validate json with types!_

You ever take json data from the server and want to verify it matches some interface? This library is for you!

Depends on fp-ts

```typescript
// example interface
interface Rec {
  num: number;
  str: string;
  arr: number[];
  bool: boolean;
};

// Validator spec
const rec: RecordValidator<Rec> = {
  num: num,
  str: str,
  arr: arrayOf(num),
  bool: bool,
};

const someData = JSON.parse(`{"num": 1, "str": "hi", "arr": [1], "bool": false}`);

// usage
record(rec)(someData); // => Option<Rec>

```

Docs coming soon. Check out src/index.spec.ts for more usage examples.

This library isn't on NPM yet. This is just a call for feedback for the moment. 
