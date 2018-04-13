const chalk = require('chalk')
const gaze = require('gaze')
const exec = require('child_process').exec

const { challengePath, challengeFilename, strfy } = require('./workbench.common.js')
const _challengePath = challengePath(process.argv)
const _challengeFilename = challengeFilename(process.argv)
const { name, main, cases } = require(_challengePath)



const glob = [_challengePath, './workbench.common.js', './workbench.test.js', './workbench.report.js']
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
        childProcess(`npm run report -- ${__challengeFilename}`).catch(err => console.error(err)),
        childProcess(`npm run test -- ${__challengeFilename}`).catch(err => console.error(err))
    ])
    .then(
        () => { console.log(`\n${chalk.green('all child processes for a cycle terminated')}`)},
        reason => console.error(reason)
    )
    .catch(e => console.error(e))
}

function childProcess(command) {

    return new Promise((resolve, reject) => {
        const cmd = exec(command)

        cmd.stdout.on('data', (data) => {
            process.stdout.write(data)
        })
        
        cmd.stderr.on('data', (data) => {
            process.stdout.write(data)
        })
        
        cmd.on('close', (code) => {
            if (code !== 0) {
                console.error(chalk.red(`child process exited with code ${code} :: ${command}`))
                resolve()
            } else {
                resolve()
            }
        })
    })
}

