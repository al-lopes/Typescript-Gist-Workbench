////////////////////////////////////////////////////////////////////////////////
const { exec } = require('child_process');

const gulp = require('gulp');
const { grey, red } = require('chalk/index.js');
////////////////////////////////////////////////////////////////////////////////

gulp.task("develop", async function () {
    const tsc = await run('compiler -- -p ./workbench.src/workbench.tsconfig.json')
    const example = await run('supervisor once -- debug example')
});

function run(command) {
    return new Promise((resolve, reject) => {
        const childProcess = exec(`npm run ${command}`, { shell: true });

        childProcess.stdout.on('data', (data) => {
            process.stdout.write(data);
        })

        childProcess.stderr.on('data', (data) => {
            process.stderr.write(data);
        })

        childProcess.on('exit', (code, signal) => {
            if (code !== 0) {
                console.error(red(`GULP[${command}] childProcess exited with code ${code}, signal: ${signal}`));
                resolve();
            } else {
                console.log(grey(`GULP[${command}] childProcess exited with code ${code}, signal: ${signal}`));
                resolve();
            }
        })
    })
}

gulp.task('develop-watch', ['develop'], function() {
    gulp.watch(['./gists/*', './workbench.src/*'], ['develop']);
});
