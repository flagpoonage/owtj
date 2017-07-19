# owtj
A very simple JSON stringifier for NodeJS that takes care or circular references.

## Usage

The export of the `owtj` package is a simple function that takes a JS object and converts it to a JSON string.

```
const owtj = require('owtj');

var circularObject = {
  a: {
    text: 'Hello'
  }
};

// Set a circular reference to see the output.
circularObject.a.b = circularObject.a;

owtj(circularObject);

//  PRINTS
//  { "a": { "text": "Hello", "b": "[Circular]" } }
```

## Stringify options

The `owtj` function takes the same parameters as `JSON.stringify` (in fact, that's what it uses underneath)


```
const owtj = require('owtj');

var circularObject = {
  a: {
    text: 'Hello'
  }
};

// Set a circular reference to see the output.
circularObject.a.b = circularObject.a;

owtj(circularObject, null, 2);

//  PRINTS
//  { 
//    "a": { 
//      "text": "Hello", 
//      "b": "[Circular]" 
//    } 
//  }
```
