# Typescript Gist Workbench

Workbench for unit testing and profiling typescript and javascript gists.

## Usage
run ```npm install``` to install this project dependencies,
then start coding you own gists.

### Gists
Each gist should correspond to a typescript file in
[./gists.src](./gists.src), and each file name can be passed as an argument to
[this project scripts](###scripts).
E.g.: running ```npm run supervisor -- example``` will
unit test, profile and watch [./gists.src/example.ts](./gists.src/example.ts).

All Gist files should export and object following
[the Gist interface](./testbench.src/testbench.model.ts). 

### Scripts

#### ```npm run supervisor -- example```
Will run both commands bellow and start watching for changes

#### ```npm run test -- example```
Will start [jest](https://facebook.github.io/jest/) for
[./gists/example.ts](./gists/example.ts)

#### ```npm run report -- example```
Will record execution times for
[./gists/example.ts](./gists/example.ts)


---
MIT License | Copyright © Alexandre Lopes