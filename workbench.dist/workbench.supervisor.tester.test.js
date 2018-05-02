"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////////////////////
const workbench_model_1 = require("./workbench.model");
const workbench_module_1 = require("./workbench.module");
const config = require('../workbench.config.json');
////////////////////////////////////////////////////////////////////////////////
const debug = process.argv.indexOf('debug') > 0 ? true : false;
const workbench = new workbench_module_1.Workbench(debug);
const gistFile = new workbench_model_1.File({
    dir: config.distDir,
    name: process.argv[process.argv.length - 1],
    ext: '.js'
});
const { gist } = require(`.${gistFile.path}`);
describe(gist.name, () => {
    gist.testables.forEach((testable, i) => {
        it(`#${i} ${testable.header}`, () => expect(gist.main(...testable.args)).toEqual(testable.returns));
    });
});
//# sourceMappingURL=workbench.supervisor.tester.test.js.map