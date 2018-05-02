"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////////////////////
const path_1 = require("path");
const gaze = require("gaze");
const chalk = require("chalk/index.js");
const workbench_model_1 = require("./workbench.model");
const workbench_module_1 = require("./workbench.module");
const childprocess_module_1 = require("./childprocess.module");
const config = require('../workbench.config.json');
////////////////////////////////////////////////////////////////////////////////
const debug = process.argv.indexOf('debug') >= 0 ? true : false;
const once = process.argv.indexOf('once') >= 0 ? true : false;
const profilerOnly = process.argv.indexOf('profilerOnly') >= 0 ? true : false;
const testerOnly = process.argv.indexOf('testerOnly') >= 0 ? true : false;
const workbench = new workbench_module_1.Workbench(debug);
const file = new workbench_model_1.File({
    dir: config.srcDir,
    name: process.argv[process.argv.length - 1],
    ext: '.ts'
});
if (!once) {
    const gazable = [config.srcDir + '**'];
    gaze(gazable, function (err, watcher) {
        if (err)
            workbench.log(err, 'error');
        const watched = this.watched();
        console.log(chalk.blue(`Gazing: [${gazable}]`));
        cycle();
        this.on('all', function (event, filepath) {
            return __awaiter(this, void 0, void 0, function* () {
                cycle(event, filepath);
            });
        });
    });
}
else {
    console.log(chalk.blue(`Running Once`));
    cycle();
}
function cycle(event, filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event && filepath) {
            console.log(chalk.magenta(`.${filepath.replace(path_1.normalize(__dirname + '/..'), '')} ${event}`));
        }
        const gistFile = new workbench_model_1.File({
            dir: config.srcDir,
            name: process.argv[process.argv.length - 1],
            ext: '.ts'
        });
        yield workbench.load(gistFile, config.distDir);
        // Profile
        if (!testerOnly) {
            yield new childprocess_module_1.Childprocess('exec', {
                command: `npm run profiler -- supervisor ${debug ? 'debug' : ''} ${file.name}`,
                name: 'Supervisor.profiler',
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
        ;
        // Test
        if (!profilerOnly) {
            yield new childprocess_module_1.Childprocess('exec', {
                command: `npm run tester -- supervisor ${debug ? 'debug' : ''} ${file.name}`,
                name: 'Supervisor.tester',
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
        ;
    });
}
//# sourceMappingURL=workbench.supervisor.js.map