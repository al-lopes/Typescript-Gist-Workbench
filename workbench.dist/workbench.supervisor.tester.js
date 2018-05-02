"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////////////////////
const childprocess_module_1 = require("./childprocess.module");
const workbench_model_1 = require("./workbench.model");
const workbench_module_1 = require("./workbench.module");
const config = require('../workbench.config.json');
////////////////////////////////////////////////////////////////////////////////
const supervisor = process.argv.indexOf('supervisor') >= 0 ? true : false;
const debug = process.argv.indexOf('debug') >= 0 ? true : false;
const workbench = new workbench_module_1.Workbench(debug);
if (supervisor) {
    const gistFile = new workbench_model_1.File({
        dir: config.distDir,
        name: process.argv[process.argv.length - 1],
        ext: '.js'
    });
    const { gist } = require(`.${gistFile.path}`);
    tester(gistFile);
}
else {
    const gistFile = new workbench_model_1.File({
        dir: config.srcDir,
        name: process.argv[process.argv.length - 1],
        ext: '.ts'
    });
    workbench.load(gistFile, config.distDir)
        .then(gist => { tester(gistFile); })
        .catch(e => { workbench.log(e, 'error'); });
}
function tester(gistFile) {
    new childprocess_module_1.Childprocess('fork', {
        command: `node_modules/jest/bin/jest.js`,
        arguments: ['--color', './workbench.dist/workbench.supervisor.tester.test.js', gistFile.name],
        name: 'Workbench.tester.test',
        debug: workbench.debug,
        debuggable: debug
    }).run()
        .then(onClose => {
        if (!onClose.success) {
            return false;
        }
        return true;
    })
        .catch(e => {
        workbench.log(e, 'error');
        return false;
    });
}
//# sourceMappingURL=workbench.supervisor.tester.js.map