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
8. `Total`: 2 + 3 + 4 + 5 + 6 + LC DOT(ACALA)

## Key-Parameters
| desc  | key|  desc| data source
| ------ | --------|--------|------ |
| Stablecoin Tvl  | karuraStable / acalaStable |  | api.query.loans.totalPositions|
| Total Liquid StakingToken TVL  | karuraTotalLiquidToken / acalaTotalLiquidToken |  | total staking in homa = toBond(api.query.homa.toBondPool) + totalInSubAccount(api.query.homa.stakingLedgers);| 
| Total Liquid StakingToken Value  | karuraTotalLiquidTokenValue / acalaTotalLiquidTokenValue | Stablecoin Tvl * prices | |
| StakingToken Bridge TVL  | karuraTotalStakingTokenBridge/ acalaTotalStakingTokenBridge |  | total staking(equal to `totalLiquidTokenTvl`) + total issuance|
| StakingToken Bridge Value  | karuraTotalStakingTokenBridgeValue/ acalaTotalStakingTokenBridgeValue | StakingToken Bridge TVL * prices | |
| LP Token Staking TVL  | karuraTotalLpTokenStaking / acalaTotalLpTokenStaking |  |totalShares of dex tokens in (api.query.rewards.poolInfos); |
| Liquidity Pool TVL  | karuraTotalLiquidityPool / acalaTotalLiquidityPool |  |api.query.dex.liquidityPool |
| Swap | karuraSwap / acalaSwap | (karura/acala)TotalLiquidityPool + (karura/acala)TotalLpTokenStaking |
| LCDOT TVL  | lcdot | only in acala network |total issuance of lcDot|
| LCDOT Value | lcdotValue | LCDOT TVL * price of DOT |
| Total  | karuraTotal / acalaTotal | (karura/acala)Stable + (karura/acala)TotalLiquidTokenValue +  (karura/acala)acalaTotalStakingTokenBridgeValue + (karura/acala)acalaSwap + (acala)lcdotValue|