////////////////////////////////////////////////////////////////////////////////
function example(a, b) { return a + b }


////////////////////////////////////////////////////////////////////////////////
module.exports = {
    name: 'Example',
    url: 'https://www.test.com/challenges/example/problem',
    main: example,
    cases: [
        { params: [201, 301], out: 502},
        { params: [10, 1000], out: 1010},
        { params: [0, 10001], out: 10001}
    ]
}