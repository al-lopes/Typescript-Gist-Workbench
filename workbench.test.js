const { challengePath, strfy } = require('./workbench.common.js')
const { name, main, cases } = require(`${challengePath(process.argv)}`)



Promise.all(cases.map((c, i) => test(c, i)))
    .then(
        tests => tests.forEach(test => { }),
        reason => console.error(reason)
    )
    .catch(e => console.error(e))


function test(c, i) {
    return new Promise((resolve, reject) => {
        try {
            const header = `Testcase ${i} :: ${strfy(c.params)} -> ${strfy(c.out)}`;
    
            it(header, () => {
                expect(main(...c.params)).toEqual(c.out)
                resolve()
            })

        } catch (e) {
            reject(e)
        }
    })
}
