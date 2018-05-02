"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////////////////////////////////////////////////
const child_process_1 = require("child_process");
const events_1 = require("events");
const chalk = require("chalk/index.js");
////////////////////////////////////////////////////////////////////////////////
class Childprocess {
    constructor(type, params) {
        this.EE = new events_1.EventEmitter;
        this.name = params.name;
        this.type = type;
        this.command = params.command;
        this.arguments = params.arguments;
        this.tag = chalk.cyan(`${type.toUpperCase()}[${chalk.grey(this.name)}]`);
        this.debug = params.debug;
        this.debuggable = params.debuggable;
        this.debug(this.debuggable, this.tag, '.constructor() ' + JSON.stringify({ command: params.command, arguments: params.arguments }));
    }
    run() {
        try {
            this.debug(this.debuggable, this.tag, '.run()');
            const payload = [];
            switch (this.type) {
                case 'exec': {
                    this.childProcess = child_process_1.exec(this.command);
                    break;
                }
                case 'fork': {
                    this.childProcess = child_process_1.fork(this.command, this.arguments);
                    break;
                }
                case 'spawn': {
                    this.childProcess = child_process_1.spawn(this.command, this.arguments);
                    break;
                }
                default: {
                    throw new Error(`Childprocess.type not valid: ${this.type}`);
                }
            }
            return new Promise((resolve, reject) => {
                this.EE.emit('running');
                if (this.type !== 'fork') {
                    this.childProcess.stdout.on('data', (data) => {
                        this.EE.emit('stdout', data);
                        process.stdout.write(data);
                    });
                    this.childProcess.stderr.on('data', (data) => {
                        this.EE.emit('stderr', data);
                        process.stderr.write(data);
                    });
                }
                this.childProcess.on('message', (data) => {
                    this.EE.emit('message', data);
                    payload.push(data);
                });
                this.childProcess.on('close', (code, signal) => {
                    this.EE.emit('close', { code, signal });
                    if (code !== 0) {
                        this.debug(true, chalk.red(this.tag), `.childProcess exited with code ${code}, signal: ${signal}`);
                        resolve({ success: false, payload: payload, tag: this.tag });
                    }
                    else {
                        this.debug(this.debuggable, this.tag, `.childProcess exited with code ${code}, signal: ${signal}\n`);
                        resolve({ success: true, payload: payload, tag: this.tag });
                    }
                });
            });
        }
        catch (e) {
            console.error(e, 'error');
        }
    }
}
exports.Childprocess = Childprocess;
//# sourceMappingURL=childprocess.module.js.map