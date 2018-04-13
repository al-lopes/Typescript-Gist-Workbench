const chalk = require('chalk')
const gaze = require('gaze')
const exec = require('child_process').exec

const impact = require('./sympact')
const { challengePath, challengeFilename, strfy } = require('./workbench.common.js')
const _challengePath = challengePath(process.argv)
const _challengeFilename = challengeFilename(process.argv)
const { name, main, cases } = require(_challengePath)


Promise.all(cases.map((c, i) => report(c, i)))
    .then(
        reports => reports.forEach(report => console.log(report)),
        reason => console.error(reason)
    )
    .catch(e => console.error(e))

function report(c, i) {

    const header = `Testcase ${i} :: ${strfy(c.params)} -> ${strfy(c.out)}`;

    return new Promise((resolve, reject) => {
        try {
           impact(`
                ${main}
                return ${main.name}(${[...c.params.map(x => strfy(x))].join(', ')})
            `)
                .then(analysis => {
                    const exec = analysis.times.execution.end - analysis.times.execution.start;
                    const cpu = analysis.stats.cpu; // percentage
                    const ram = analysis.stats.memory; // bytes
                    resolve(
                        '\n' + header + '\n' + chalk.blue(
                        `Execution time: ${(exec*1e-6).toFixed(3)} ms\n` +
                        `CPU: ${strfy(cpu.median)} %\n` +
                        `RAM: ${strfy(ram.median / 1024)} Kilobytes`
                    ))
                })
                .catch(e => {
                    reject(e)
                })

        } catch (e) {
            reject(e)
        }
    })
}