# defillama-acala-tvl

Scripts for calculating Acala/Karura TVL.

## Running

1. install dependencies with `yarn`
2. run `yarn start`

## data source
1. token price: Price of all tokens comes from acala.js;
2. `stableCoin`: api.query.loans.totalPositions
3. `totalLiquidTokenTvl`: total staking in homa = toBond(api.query.homa.toBondPool) + totalInSubAccount(api.query.homa.stakingLedgers);
4. `stakingTokenBridgeTvl`: = total staking(equal to `totalLiquidTokenTvl`) + total issuance
5. `lpTokenStakingTvl`: totalShares of dex tokens in (api.query.rewards.poolInfos);
6. `liquidityPoolTvl`: api.query.dex.liquidityPool
7. `swap`: lpTokenStakingTvl + liquidityPoolTvl;