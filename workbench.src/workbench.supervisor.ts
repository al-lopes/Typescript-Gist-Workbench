////////////////////////////////////////////////////////////////////////////////
import { normalize } from 'path';

import * as gaze from 'gaze';
import * as chalk from 'chalk/index.js';

import { File } from './workbench.model';
import { Workbench } from './workbench.module';
import { Childprocess } from './childprocess.module';
const config = require('../workbench.config.json');
////////////////////////////////////////////////////////////////////////////////

const debug = process.argv.indexOf('debug') >= 0 ? true : false;
const once = process.argv.indexOf('once') >= 0 ? true : false;
const profilerOnly = process.argv.indexOf('profilerOnly') >= 0 ? true : false;
const testerOnly = process.argv.indexOf('testerOnly') >= 0 ? true : false;

const workbench = new Workbench(debug);
const file = new File({
    dir: config.srcDir,
    name: process.argv[process.argv.length - 1],
    ext: '.ts'
})

if (!once) {
    const gazable = [config.srcDir + '**'];
    
    gaze(gazable, function(err, watcher): void {
        if (err) workbench.log(err, 'error');
        const watched = this.watched();
    
        console.log(chalk.blue(`Gazing: [${gazable}]`));
        cycle();
    
        this.on('all', async function(event, filepath) {
            cycle(event, filepath);
        });
    });
} else {
    console.log(chalk.blue(`Running Once`));
    cycle();
}

async function cycle(event?: string, filepath?: string): Promise<void> {
    if(event && filepath) {
        console.log(chalk.magenta(`.${filepath.replace(normalize(__dirname + '/..'), '')} ${event}`));
    }

    const gistFile = new File({
        dir: config.srcDir,
        name: process.argv[process.argv.length - 1],
        ext: '.ts'
    });

    await workbench.load(gistFile, config.distDir)

    // Profile
    if (!testerOnly) {
        await new Childprocess('exec', {
            command: `npm run profiler -- supervisor ${debug ? 'debug' : ''} ${file.name}`,
            name: 'Supervisor.profiler',
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
    };

    // Test
    if (!profilerOnly) {
        await new Childprocess('exec', {
            command: `npm run tester -- supervisor ${debug ? 'debug' : ''} ${file.name}`,
            name: 'Supervisor.tester',
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
    };
}
