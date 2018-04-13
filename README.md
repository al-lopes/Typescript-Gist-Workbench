# Hackerrank Challenge Workbench

Workbench for resolving and creating hackerrank.com challenges in
Node.js with unit testing and profilling

## Usage
run ```npm install``` to install this project dependencies, then start coding
you own challenges and challenges solutions.

### Challenge files
Each challenge should correspond to a javascript file inside
[./challenges](./challenges), and each file name can be passed as an argument to
[this project scripts](###scripts).
E.g.: running ```npm run supervisor -- example``` will
unit test, profile and watch [./challenges/example.js](./challenges/example.js)

All challenge files MUST export an object as the Challenge interface
bellow:

```typescript
interface Challenge {
    name: string;
    url: string;
    main: Function;
    cases: Testcase[];
}

interface Testcase {
    params: any[];
    out: any;
}
```

That translates into the following example:
```javascript
function example(a, b) { return a + b }

module.exports = {
    name: 'Example',
    url: 'https://www.test.com/challenges/example/problem',
    main: example,
    cases: [
        { params: [201, 301], out: 502},
        { params: [10, 1000], out: 1010},
        { params: [0, 10001], out: 10001}
    ]
}
```

### Scripts

#### ```npm run supervisor -- example```
Will run both commands bellow and start watching for changes

#### ```npm run test -- example```
Will start [jest](https://facebook.github.io/jest/) for
[./challenges/example.js](./challenges/example.js)

#### ```npm run report -- example```
Will create a custom report using [sympact](https://github.com/simonepri/sympact) for
[./challenges/example.js](./challenges/example.js)


---
MIT License | Copyright © Alexandre Lopes