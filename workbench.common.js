const debug = false

const chalk = require('chalk')
const { exec, fork } = require('child_process')

const extension = '.js'
const challengesDir = './challenges/'



module.exports = {
    extension: extension,
    challengesDir: challengesDir,
    strfy: (x, prty) => JSON.stringify(x, null, prty ? '    ' : null),
    hrtimeMicroSec: (x) => ((x[0] * 1000000) + x[1] ) / 1000,
    challengeFilename: (argArr) => {
        const argArrLastElement = argArr[argArr.length -1];
        return argArrLastElement;
    },
    challengePath: (argArr) => {
        const argArrLastElement = argArr[argArr.length -1];
        const path = challengesDir + argArrLastElement + extension;
        return path;
    },
    spawn: function (command, name) {

        return new Promise((resolve, reject) => {
            if (debug) console.log(chalk.cyan(`SPAWN[${chalk.grey(name)}] ${command}`))

            const cp = exec(command)

            cp.stdout.on('data', (data) => {
                process.stdout.write(data)
            })

            cp.stderr.on('data', (data) => {
                process.stderr.write(data)
            })

            cp.on('close', (code) => {
                if (code !== 0) {
                    console.error(chalk.red(`SPAWN[${chalk.grey(name)}] exited with code ${code} :: ${command}`))
                    resolve()
                } else {
                    if (debug) console.log(chalk.cyan(`SPAWN[${chalk.grey(name)}] exited with code ${code} :: ${command}\n`))
                    resolve()
                }
            })
        })
    },
    fork: function (command, args, name) {

        return new Promise((resolve, reject) => {
            if (debug) console.log(chalk.magenta(`FORK[${chalk.grey(name)}] ${command} ${args}`))

            const cp = fork(command, args)
            const cpFinalData = {e: null}

            cp.on('message', (msg) => {
                cpFinalData[msg.type] = msg.payload
            })

            cp.on('close', (code) => {
                if (code !== 0) {
                    console.error(chalk.red(`FORK[${chalk.grey(name)}] exited with code ${code} :: ${command}`))
                    resolve(cpFinalData)
                } else {
                    if (debug) console.log(chalk.magenta(`FORK[${chalk.grey(name)}] exited with code ${code} :: ${command}`))
                    resolve(cpFinalData)
                }
            })
        })
    }
}