export function dependency(a, b) { return a * b }

//////////////////////////////////////////////////////////////////////////////////
export const gist = {
    name: 'Example Dependency',
    main: dependency,
    testables: [
        {args: [3, 2], returns: 6}
    ]
};