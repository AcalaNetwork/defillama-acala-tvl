const { Wallet } = require("@acala-network/sdk/wallet");
const { getApi } = require("./api");
const { liquidityPoolTvl } = require("./liquidityPoolTvl");
const { lpTokenStakingTvl } = require("./lpTokenStakingTvl");
const { stableCoin } = require("./stablecoin");
const { stakingTokenBridgeTvl } = require("./stakingTokenBridgeTvl");
const { totalLiquidTokenTvl } = require("./totalLiquidTokenTvl");

const main = async () => {
  const api = await getApi('karura');
  const wallet = new Wallet(api, {
    supportAUSD: true,
  });

  await api.isReady;
  console.log('Api is ready');
  await wallet.isReady;
  console.log('Wallet is ready');

  const stable = await stableCoin(api, wallet);
  const { total: totalLiquidToken, value: totalLiquidTokenValue } = await totalLiquidTokenTvl(api, wallet);
  const { total: totalStakingTokenBridge, value: totalStakingTokenBridgeValue } = await stakingTokenBridgeTvl(api, wallet);
  const totalLpTokenStaking = await lpTokenStakingTvl(api, wallet);
  const totalLiquidityPool = await liquidityPoolTvl(api, wallet)
  const swap = totalLiquidityPool.add(totalLpTokenStaking)
  console.log(`Total Swap: ${swap.toString()} \n`);
  const total = stable.add(totalLiquidToken).add(totalStakingTokenBridge).add(swap);
  console.log(`Overall Tvl: ${total.toString()}`);
};

main();
