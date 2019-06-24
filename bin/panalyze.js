#!/usr/bin/env node

const connectionTester = require('connection-tester');

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
        connectionTester.test(
            argv.ip,
            80,
            1000,
            (err, output) => {
                console.log(output);
            }
        )
    })
    .help()
    .argv