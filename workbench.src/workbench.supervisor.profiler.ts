////////////////////////////////////////////////////////////////////////////////
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

    profiler(gist);

} else {
    const gistFile = new File({
        dir: config.srcDir,
        name: process.argv[process.argv.length - 1],
        ext: '.ts'
    });

    workbench.load(gistFile, config.distDir)
        .then(gist => { profiler(gist) })
        .catch(e => { workbench.log(e, 'error'); })
}


function profiler(gist: Gist): void {
    // TODO: find better runtime env than just running the function
    const warmup = JSON.parse(JSON.stringify(gist.testables)).forEach(testable => execute(gist.main, testable));
    setTimeout(() => {}, gist.testables.length * 120)

    const executablesPmomises = gist.testables.map(testable => execute(gist.main, testable));

    Promise.all(executablesPmomises)
        .then(executed => {

            const data = executed.map((tested, i) => {
                const curr = new Tested(tested)
                const prev = executed[(i - 1 <= 0 ? 0 : i-1)]
                return ({
                    Testcase: curr.header,
                    Returned: curr.returned,
                    Δt: +(curr.delta).toFixed(3),
                    ΔΔt: +(curr.start - (prev.start !== curr.start ? prev.end : curr.start)).toFixed(3)
                })
            })

            console['table'](data, ['Testcase', 'Returned', 'Δt', 'ΔΔt'])
        })
        .catch(e => { workbench.log(e, 'error'); })
}

function execute(fn: Function, testcase: Testable): Promise<Tested> {
    return new Promise((resolve, reject) => {
        try {
            const start = microsec(process.hrtime());
            const returned = fn(...testcase.args);
            const end = microsec(process.hrtime());

            resolve({
                args: testcase.args,
                returns: testcase.returns,
                returned: returned,
                start: start,
                end: end,
                delta: end - start,
            })
        } catch (e) {
            workbench.log(e, 'error');
            reject(e);
        }
    })
}

function microsec(hrtime) {
    return ((hrtime[0] * 1e9) + hrtime[1]) / 1e3
}