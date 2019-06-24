#!/usr/bin/env node

const connectionTester = require('connection-tester');
const logSymbols = require('log-symbols');
const chalk = require('chalk');

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
    .command('analyze [ip]', 'ip address', (yargs) => {
        yargs.positional('ip', {
            type: 'string',
            default: 'your ip',
            describe: 'the ip to scan ports of'
        })
    }, function (argv) {
            for(let port = 1; port < 1001; port++) {
                connectionTester.test(
                    argv.ip,
                    port,
                    1000,
                    (err, output) => {
                        if(err) throw err;
                        else {
                            if(output.success == false) {
                                console.log(`${logSymbols.error} ${chalk.blue('Port:')} ${chalk.green(port)} ${chalk.blue('IP:')} ${chalk.green(argv.ip)}`);
                            }
                            else if(output.success == true) {
                                console.log(`${logSymbols.success} ${chalk.blue('Port:')} ${chalk.green(port)} ${chalk.blue('IP:')} ${chalk.green(argv.ip)}`);
                            }
                        }
                    }
                )
            }    
    })
    .help()
    .argv