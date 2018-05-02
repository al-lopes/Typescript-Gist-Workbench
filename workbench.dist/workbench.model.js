"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////////////////////
const util_1 = require("util");
////////////////////////////////////////////////////////////////////////////////
exports.testHeader = (test) => {
    let args = util_1.inspect(test.args);
    let returns = util_1.inspect(test.returns);
    const threshold = 55;
    if (args.length > threshold) {
        args = `${args.substring(0, threshold - 3)}...`;
    }
    if (returns.length > threshold) {
        returns = `${returns.substring(0, threshold - 3)}...`;
    }
    return Object.assign(test, { header: `${args} → ${returns}` });
};
class Gist {
    constructor(gist) {
        const testables = gist.testables
            .map(testable => exports.testHeader(testable));
        Object.assign(this, gist, { testables });
    }
}
exports.Gist = Gist;
class Tested {
    constructor(testedcase) {
        Object.assign(this, exports.testHeader(testedcase));
    }
}
exports.Tested = Tested;
class File {
    constructor(file) {
        Object.assign(this, file);
        this.path = `${this.dir}${this.name}${this.ext}`;
    }
}
exports.File = File;
//# sourceMappingURL=workbench.model.js.map