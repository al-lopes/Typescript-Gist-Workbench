////////////////////////////////////////////////////////////////////////////////
import { inspect } from 'util';
////////////////////////////////////////////////////////////////////////////////

export const testHeader = (test: Testable|Tested): Testable|Tested => {
    let args = inspect(test.args);
    let returns = inspect(test.returns);

    const threshold = 55;

    if (args.length > threshold) {
        args = `${args.substring(0, threshold - 3)}...`;
    }

    if (returns.length > threshold) {
        returns = `${returns.substring(0, threshold - 3)}...`;
    }

    return Object.assign(test, {header: `${args} → ${returns}`});
}

export class Gist {
    name: string;
    url?: string;
    main: Function;
    testables: Testable[];

    constructor(gist: Gist) {

        const testables: Testable[] = gist.testables
            .map(testable => testHeader(testable));

        Object.assign(this, gist, {testables});
    }
}

export interface Testable {
    args: any[];
    returns: any;
    header?: string;
}

export class Tested implements Testable {
    args: any[];
    returns: any;

    returned: any;
    start: number;
    end: number;
    delta: number;

    header?: string;

    constructor(testedcase: Tested) {
        Object.assign(this, testHeader(testedcase));
    }
}

export class File {
    name: string;
    ext: string;
    dir: string;
    path?: string;

    constructor(file: File) {
        Object.assign(this, file);
        this.path = `${this.dir}${this.name}${this.ext}`;
    }
}