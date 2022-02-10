# Chain ESM modules

Currently only supports `transformSource`

To use, add esm-chain-loader as the <u>last</u> loader
```
node script --experimental-loader loader1 --experimental-loader ./path/to/loader2.js --experimental esm-chain-loader
```