# defillama-acala-tvl

Scripts for calculating Acala/Karura TVL.

## Running

1. install dependencies with `yarn`
2. run `yarn start`

## Usage

`dex.js`, `loans.js`, and `staking.js` export a function `tvl` as well as a methodology describing how the TVL is calculated.

The `tvl` function takes one parameter `chainName` which can either be `acala` or `karura`. The output of the function is an object that can be given to the CoinGecko API to get the total TVL for that protocol in USD for the given chain.