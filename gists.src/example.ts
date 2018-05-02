import { dependency } from './example.dependency';

export function example(a, b) { return dependency(a, b) + b }

//////////////////////////////////////////////////////////////////////////////////
import { Gist } from '../workbench.dist/workbench.model.js'
export const gist = new Gist({
    name: 'Example',
    main: example,
    testables: [
        {args: [1, 1], returns: 2},
        {args: [1, 2], returns: 4},
        {args: [3000, 2000], returns: 6002000},
        {args: ['a', 12], returns: NaN},
        {args: [12, 'a'], returns: 'NaNa'},
        {args: [null, 12], returns: 12},
        {args: [12, null], returns: 0},
        {args: [undefined, 12], returns: NaN},
        {args: [12, undefined], returns: NaN},
        {args: [Infinity, 12], returns: Infinity},
        {args: [12, Infinity], returns: Infinity},
    ]
});