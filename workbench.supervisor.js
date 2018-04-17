const chalk = require('chalk')
const gaze = require('gaze')

const { challengePath, challengeFilename, strfy, spawn } = require('./workbench.common.js')
const _challengePath = challengePath(process.argv)
const _challengeFilename = challengeFilename(process.argv)
const { name, main, cases } = require(_challengePath)



const glob = [_challengePath, './workbench.*', '!./workbench.supervisor.js']
gaze(glob, function(err, watcher) {
    if (err) console.error(err)

    console.log(chalk.yellow(`gazing ${strfy(glob)}\n`))
    cycle(_challengePath, _challengeFilename, 'changes will re run tests and profillings')

    this.on('changed', (filepath) => {
        cycle(_challengePath, _challengeFilename, `${filepath} was changed`)
    })
})

function cycle(__challengePath, __challengeFilename, message) {
    console.log(chalk.magenta(`\nChallenge: ${name}`))
    console.log(chalk.magenta(message))

    Promise.all([
        spawn(`npm run report -- ${__challengeFilename}`, 'report').catch(err => console.error(err)),
        spawn(`npm run test -- ${__challengeFilename}`, 'test').catch(err => console.error(err))
    ])
    .then(
        () => { console.log(`\n${chalk.green('all child processes for a cycle terminated')}`)},
        reason => console.error(reason)
    )
    .catch(e => console.error(e))
}
