////////////////////////////////////////////////////////////////////////////////
import { inspect } from 'util';

import * as chalk from 'chalk/index.js';

import { File, Gist } from './workbench.model';
import { Childprocess } from './childprocess.module';
////////////////////////////////////////////////////////////////////////////////

export class WorkbenchUtilities {
    debuggable: boolean;

    constructor(debuggable) {
        this.debuggable = debuggable;
    }

    log(x: any, level?: string): void {
        switch(level) {
            case 'error': {
                console.error(chalk.red(x));
            }
            default: {
                console.log(inspect(x, { showHidden: true, depth: null }));
            }
        }
    }

    debug(debuggable: boolean, tag: string, arg: string): void {
        if (debuggable) console.log(tag + chalk.cyan(arg));
    }
}

export class Workbench extends WorkbenchUtilities {

    public async load(file: File, distDir: string): Promise<Gist> {
        try {
            const compiled: boolean = await this.compile(file, distDir);
            if (!compiled) { throw new Error(`Workbench.load() ${file.name} did not compile`); }
    
            const gist: Gist = await this.extract(file, distDir);
            if(!gist) { throw new Error(`Workbench.load() ${file.name} gist did not extract`); }
    
            return gist;
        } catch (e) {
            this.log(e, 'error');
        }
    }

    private async compile(file: File, distDir: string): Promise<boolean> {
        return new Childprocess('fork', {
            command: `node_modules/typescript/bin/tsc`,
            arguments: [file.path, '--outDir', distDir, '--sourceMap', '--lib', 'ES2015'],
            name: 'Workbench.compiler',
            debug: this.debug,
            debuggable: this.debuggable
        }).run()
            .then(onClose => {
                if (!onClose.success) { return false; }
                return true;
            })
            .catch(e => {
                this.log(e, 'error');
                return false;
            });
    }

    private async extract(file: File, distDir: string): Promise<Gist> {
        try {
            const jsFile = new File({
                dir: distDir,
                name: file.name,
                ext: '.js'
            })

            const imports = require('.' + jsFile.path);
            if (!imports.hasOwnProperty('gist')) { throw new Error(`Workbench.extract() ${jsFile.path} has no gist`); }

            return imports.gist;

        } catch (e) {
            this.log(e, 'error');
        }
    }
}
