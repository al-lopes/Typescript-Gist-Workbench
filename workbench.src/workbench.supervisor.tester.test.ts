////////////////////////////////////////////////////////////////////////////////
import { File, Gist, Testable } from './workbench.model';
import { Workbench } from './workbench.module';
const config = require('../workbench.config.json');
////////////////////////////////////////////////////////////////////////////////

const debug = process.argv.indexOf('debug') > 0 ? true : false;
const workbench = new Workbench(debug);
const gistFile = new File({
    dir: config.distDir,
    name: process.argv[process.argv.length - 1],
    ext: '.js'
})
const { gist }: {gist: Gist} = require(`.${gistFile.path}`)

describe(gist.name, () => {

    gist.testables.forEach((testable: Testable, i) => {
        it(`#${i} ${testable.header}`, () => expect(gist.main(...testable.args)).toEqual(testable.returns));
    })
})