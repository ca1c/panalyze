#!/usr/bin/env node

const connectionTester = require('connection-tester');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const getIP = require('external-ip')();
const find = require('local-devices');
const fs = require('fs');

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
            type: 'string',
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
        let scannedip;
        if (!argv.ip) {
            console.log(`${logSymbols.warning} ${chalk.yellow('Please provide the ip of the host you would like to scan')}`)
        } else if (argv.ip && argv.ip !== 'localpublic') {
            scannedip = argv.ip;
            scan();
        } else if (argv.ip == 'localpublic') {
            getIP((err, ip) => {
                if (err) {
                    throw err;
                }
                scannedip = ip;
                scan();
            });
        } else if (ip.isV4Format(argv.ip) == false) {
            console.log(`${logSymbols.warning} ${chalk.yellow('Ip must be in the correct IPV4 format, example: 127.0.0.1')}`)
        }
        if (!argv.options) {
            console.log(`${logSymbols.warning} ${chalk.yellow('Please provide the type of scan you would like to start')}`);
        }

        function scan() {
            if (argv.options == 'q') {
                let data = [];
                var scanPromise = new Promise(function(resolve, reject) {
                    for (let i = 0; i < portOptions.quickScanArray.length; i++) {
                        connectionTester.test(
                            scannedip,
                            portOptions.quickScanArray[i],
                            1000,
                            (err, output) => {
                                if (err) reject(err);
                                else {
                                    if (output.success == false) {
                                        console.log(`${logSymbols.error} ${chalk.blue('Port:')} ${chalk.green(portOptions.quickScanArray[i])} ${chalk.blue('IP:')} ${chalk.green(scannedip)}`);
                                        data.push(`{success: false, port: ${portOptions.quickScanArray[i]}, ip: ${scannedip}}`);
                                        resolve();
                                    } else if (output.success == true) {
                                        console.log(`${logSymbols.success} ${chalk.blue('Port:')} ${chalk.green(portOptions.quickScanArray[i])} ${chalk.blue('IP:')} ${chalk.green(scannedip)}`);
                                        data.push(`{"success": true, "port": "${portOptions.quickScanArray[i]}", "ip": "${scannedip}"}`);
                                        resolve();
                                    }
                                }
                            }
                        )
                    }
                })
                scanPromise.then(() => {
                    let realdata = JSON.stringify(data);
                    fs.writeFile('data/temporary.json', JSON.parse(realdata), (err) => {
                        if (err) throw err;

                        console.log('file saved temporarily');
                    });
                }).catch((err) => {
                    console.log(err);
                })
            }
            if (argv.options == 'r') {
                if (argv.options == 'r' && argv.rangeFN > 0 && argv.rangeSN < 65535) {
                    for (let i = argv.rangeFN; i - 1 < argv.rangeSN; i++) {
                        connectionTester.test(
                            scannedip,
                            i,
                            1000,
                            (err, output) => {
                                if (err) throw err;
                                else {
                                    if (output.success == false) {
                                        console.log(`${logSymbols.error} ${chalk.blue('Port:')} ${chalk.green(i)} ${chalk.blue('IP:')} ${chalk.green(scannedip)}`);
                                    } else if (output.success == true) {
                                        console.log(`${logSymbols.success} ${chalk.blue('Port:')} ${chalk.green(i)} ${chalk.blue('IP:')} ${chalk.green(scannedip)}`);
                                    }
                                }
                            }
                        )
                    }
                } else if (argv.options == 'r' && !argv.rangeFN || !argv.rangeSN) {
                    console.log(`${logSymbols.warning} ${chalk.yellow('Please either provide the first, last or both range numbers')}`);
                } else if (argv.options == 'r' && argv.rangeFN <= 0 || argv.rangeSN > 65535) {
                    console.log(`${logSymbols.warning} ${chalk.yellow('The first range number must be greater than 1 and the second number must be less than 65535')}`);
                } else {
                    console.log(`${logSymbols.warning} ${chalk.yellow('Please give a valid scan type')}`)
                }
            }
        }
    })
    .command('publicip', 'returns client public ip', (yargs) => {
        console.log(chalk.green('Searching...'))
    }, function (argv) {
        getIP((err, ip) => {
            if (err) {
                throw err;
            }
            console.log(chalk.blue(ip));
        });
    })
    .command('localaddresses', 'returns ip addresses and mac addresses of all local devices connected to your network', (yargs) => {
        console.log(chalk.green('Searching...'))
    }, function (argv) {
        find().then(devices => {
            // console.log(devices);
            for (let i = 0; i < devices.length; i++) {
                let device = devices[i];
                let name = device.name.split('.');
                console.log(`${name[0]} ${chalk.green(device.ip)} ${chalk.blue(device.mac)}`)
            }
        })
    })
    .help()
    .argv