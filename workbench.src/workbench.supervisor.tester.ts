////////////////////////////////////////////////////////////////////////////////
import { Childprocess } from './childprocess.module';
import { File, Gist, Testable, Tested } from './workbench.model';
import { Workbench } from './workbench.module';
const config = require('../workbench.config.json');
////////////////////////////////////////////////////////////////////////////////

const supervisor = process.argv.indexOf('supervisor') >= 0 ? true : false;
const debug = process.argv.indexOf('debug') >= 0 ? true : false;
const workbench = new Workbench(debug);

if (supervisor) {
    const gistFile = new File({
        dir: config.distDir,
        name: process.argv[process.argv.length - 1],
        ext: '.js'
    });
    const { gist }: {gist: Gist} = require(`.${gistFile.path}`);

    tester(gistFile);
} else {
    const gistFile = new File({
        dir: config.srcDir,
        name: process.argv[process.argv.length - 1],
        ext: '.ts'
    });

    workbench.load(gistFile, config.distDir)
        .then(gist => { tester(gistFile) })
        .catch(e => { workbench.log(e, 'error'); })
}

function tester(gistFile: File): void {
    new Childprocess('fork', {
        command: `node_modules/jest/bin/jest.js`,
        arguments: ['--color', './workbench.dist/workbench.supervisor.tester.test.js', gistFile.name],
        name: 'Workbench.tester.test',
        debug: workbench.debug,
        debuggable: debug
    }).run()
        .then(onClose => {
            if (!onClose.success) { return false; }
            return true;
        })
        .catch(e => {
            workbench.log(e, 'error');
            return false;
        });
}
