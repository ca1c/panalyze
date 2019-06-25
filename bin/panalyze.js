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
    .command('hello [name]', 'welcome ter yargs!', (yargs) => {
        yargs.positional('name', {
            type: 'string',
            default: 'Cambi',
            describe: 'the name to say hello to'
        })
    }, function (argv) {
        console.log('hello', argv.name, 'welcome to yargs!')
    })
    .command('analyze [ip] [options]', 'ip address', (yargs) => {
        yargs.positional('ip', {
            type: 'string',
            default: 'your ip',
            describe: 'ip to be scanned'
        })
        yargs.positional('options', {
            type:'string',
            default: 'quickscan',
            describe: 'type of scan'
        })
    }, function (argv) {
            if(argv.options == 'quickscan') {
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
    })
    .help()
    .argv