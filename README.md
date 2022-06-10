# defillama-acala-tvl

Scripts for calculating Acala/Karura TVL.

## Running

1. install dependencies with `yarn`
2. run `yarn start`

## data source
1. token price: Price of all tokens comes from acala.js;
2. `Stablecoin Tvl`: api.query.loans.totalPositions
3. `Total Liquid stakingToken TVL`: total staking in homa = toBond(api.query.homa.toBondPool) + totalInSubAccount(api.query.homa.stakingLedgers);
4. `StakingToken Bridge TVL`: = total staking(equal to `totalLiquidTokenTvl`) + total issuance
5. `LP Token Staking TVL`: totalShares of dex tokens in (api.query.rewards.poolInfos);
6. `Liquidity Pool TVL`: api.query.dex.liquidityPool
7. `Swap`: lpTokenStakingTvl + liquidityPoolTvl;
8. `total`: 2 + 3 + 4 + 5 + 6 + LC DOT(ACALA)