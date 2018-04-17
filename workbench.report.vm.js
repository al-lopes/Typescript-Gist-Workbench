const { challengePath, challengeFilename, hrtimeMicroSec } = require('./workbench.common.js')
const _challengePath = challengePath(process.argv)
const _challengeFilename = challengeFilename(process.argv)
const { name, main, cases } = require(_challengePath)
const index = +process.argv[process.argv.length -2]

const start = hrtimeMicroSec(process.hrtime())
const output = main(...cases[index].params)
const end = hrtimeMicroSec(process.hrtime())

process.send({
    type: 'execution',
    payload: {
        index: index,
        output: output,
        start: start,
        end: end,
        delta: end - start
    },
})