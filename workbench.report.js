const chalk = require('chalk')
const gaze = require('gaze')

const { challengePath, challengeFilename, strfy, fork } = require('./workbench.common.js')
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
            fork('workbench.report.vm.js', ['--', i, _challengeFilename], `report.vm.${i}`)
                .then(result => resolve(
                    header + '\n' +
                    chalk.blue(result.execution.delta + ' µs\n')
                ))
                .catch(err => console.error(err))

        } catch (e) {
            reject(e)
        }
    })
}