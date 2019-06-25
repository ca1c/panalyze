#!/usr/bin/env node

const connectionTester = require('connection-tester');
const logSymbols = require('log-symbols');
const chalk = require('chalk');

const portOptions = {
    quickScanArray: [20, 21, 22, 23, 25, 53, 67, 68, 69, 80, 110, 123, 137, 138, 139, 143, 161, 162, 179, 389, 443, 636, 989, 990]
}

require('yargs')
    .scriptName("panalyze")
    .usage('$0 <cmd> [args]')
    .command('analyze [ip] [options] [rangeFN] [rangeSN]', 'ip address', (yargs) => {
        yargs.positional('ip', {
            type: 'string',
            describe: 'ip to be scanned'
        })
        yargs.positional('options', {
            type:'string',
            describe: 'type of scan'
        })
        yargs.positional('rangeFN', {
            type: 'string',
            describe: 'first number of port range (optional but must have both numbers if using)',
        })
        yargs.positional('rangeSN', {
            type: 'string',
            describe: 'second number of port range (optional but must have both numbers if using)',
        })
    }, function (argv) {
            if(argv.options == 'q') {
                for(let i = 0; i < portOptions.quickScanArray.length; i++) {
                    connectionTester.test(
                        argv.ip,
                        portOptions.quickScanArray[i],
                        1000,
                        (err, output) => {
                            if(err) throw err;
                            else {
                                if(output.success == false) {
                                    console.log(`${logSymbols.error} ${chalk.blue('Port:')} ${chalk.green(portOptions.quickScanArray[i])} ${chalk.blue('IP:')} ${chalk.green(argv.ip)}`);
                                }
                                else if(output.success == true) {
                                    console.log(`${logSymbols.success} ${chalk.blue('Port:')} ${chalk.green(portOptions.quickScanArray[i])} ${chalk.blue('IP:')} ${chalk.green(argv.ip)}`);
                                }
                            }
                        }
                    )
                }
            }
            if(argv.options == 'r' && argv.rangeFN > 0 && argv.rangeSN < 65535) {
                for(let i = argv.rangeFN; i - 1 < argv.rangeSN; i++) {
                    connectionTester.test(
                        argv.ip,
                        i,
                        1000,
                        (err, output) => {
                            if(err) throw err;
                            else {
                                if(output.success == false) {
                                    console.log(`${logSymbols.error} ${chalk.blue('Port:')} ${chalk.green(i)} ${chalk.blue('IP:')} ${chalk.green(argv.ip)}`);
                                }
                                else if(output.success == true) {
                                    console.log(`${logSymbols.success} ${chalk.blue('Port:')} ${chalk.green(i)} ${chalk.blue('IP:')} ${chalk.green(argv.ip)}`);
                                }
                            }
                        }
                    )
                }
            } 
    })
    .help()
    .argv