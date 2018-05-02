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
const util_1 = require("util");
const chalk = require("chalk/index.js");
const workbench_model_1 = require("./workbench.model");
const childprocess_module_1 = require("./childprocess.module");
////////////////////////////////////////////////////////////////////////////////
class WorkbenchUtilities {
    constructor(debuggable) {
        this.debuggable = debuggable;
    }
    log(x, level) {
        switch (level) {
            case 'error': {
                console.error(chalk.red(x));
            }
            default: {
                console.log(util_1.inspect(x, { showHidden: true, depth: null }));
            }
        }
    }
    debug(debuggable, tag, arg) {
        if (debuggable)
            console.log(tag + chalk.cyan(arg));
    }
}
exports.WorkbenchUtilities = WorkbenchUtilities;
class Workbench extends WorkbenchUtilities {
    load(file, distDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const compiled = yield this.compile(file, distDir);
                if (!compiled) {
                    throw new Error(`Workbench.load() ${file.name} did not compile`);
                }
                const gist = yield this.extract(file, distDir);
                if (!gist) {
                    throw new Error(`Workbench.load() ${file.name} gist did not extract`);
                }
                return gist;
            }
            catch (e) {
                this.log(e, 'error');
            }
        });
    }
    compile(file, distDir) {
        return __awaiter(this, void 0, void 0, function* () {
            return new childprocess_module_1.Childprocess('fork', {
                command: `node_modules/typescript/bin/tsc`,
                arguments: [file.path, '--outDir', distDir, '--sourceMap', '--lib', 'ES2015'],
                name: 'Workbench.compiler',
                debug: this.debug,
                debuggable: this.debuggable
            }).run()
                .then(onClose => {
                if (!onClose.success) {
                    return false;
                }
                return true;
            })
                .catch(e => {
                this.log(e, 'error');
                return false;
            });
        });
    }
    extract(file, distDir) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jsFile = new workbench_model_1.File({
                    dir: distDir,
                    name: file.name,
                    ext: '.js'
                });
                const imports = require('.' + jsFile.path);
                if (!imports.hasOwnProperty('gist')) {
                    throw new Error(`Workbench.extract() ${jsFile.path} has no gist`);
                }
                return imports.gist;
            }
            catch (e) {
                this.log(e, 'error');
            }
        });
    }
}
exports.Workbench = Workbench;
//# sourceMappingURL=workbench.module.js.map