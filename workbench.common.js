const extension = '.js'
const challengesDir = './challenges/'

module.exports = {
    extension: extension,
    challengesDir: challengesDir,
    strfy: (x, prty) => JSON.stringify(x, null, prty ? '    ' : null),
    challengeFilename: (argArr) => {
        const argArrLastElement = argArr[argArr.length -1];
        return argArrLastElement;
    },
    challengePath: (argArr) => {
        const argArrLastElement = argArr[argArr.length -1];
        const path = challengesDir + argArrLastElement + extension;
        return path;
    }
}