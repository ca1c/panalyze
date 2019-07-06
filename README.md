# panalyze
**port scanner built in nodejs**

**Installation:**

`$ [sudo] npm i panalyze -g`

**Usage:**

`panalyze <cmd> [args]`

Commands:
  `panalyze scan [ip] [options] [rangeFN] [rangeSN]`           scans ports of a given ip address

  `panalyze publicip`                                             returns client public ip

  `panalyze localaddresses`                                       returns ip addresses and mac addresses of all local devices connected to your network

  `panalyze save [name]`                                          saves previous scan permanently

  `panalyze open [file]`                                          opens save file and returns data in the terminal

Options:
  `--version`  Show version number  

  `--help`     Show help                                                 