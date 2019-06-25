# panalyze
**port scanner built in nodejs**

**Usage:**

`$ panalyze [ip] [options] [rangeFN] [rangeSN]`

`[ip]` is the ip of the host that you want to scan.

you have two `[options]` for scan type, either `q` for quickscan or `r` for range scan.

if you choose range scan you are going to use `[rangeFN]` and `[rangeSN]` or in other words, the first number and the second number of the range of ports you want to scan.

`[rangeFN]` needs to be greater than **0** and `[rangeSN]` needs to be less than 65535.