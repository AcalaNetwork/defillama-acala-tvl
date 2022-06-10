const { Wallet } = require("@acala-network/sdk/wallet");
const { getApi } = require("./api");
const { lcdotTvl } = require("./lcdotTvl");
const { liquidityPoolTvl } = require("./liquidityPoolTvl");
const { lpTokenStakingTvl } = require("./lpTokenStakingTvl");
const { stableCoin } = require("./stablecoin");
const { stakingTokenBridgeTvl } = require("./stakingTokenBridgeTvl");
const { totalLiquidTokenTvl } = require("./totalLiquidTokenTvl");

const main = async () => {
  const karuraApi = await getApi('karura');
  const karuraWallet = new Wallet(karuraApi, {
    supportAUSD: true,
  });

  await karuraApi.isReady;
  console.log('karuraApi is ready');
  await karuraWallet.isReady;
  console.log('karuraWallet is ready');

  const karuraStable = await stableCoin(karuraApi, karuraWallet);
  const { total: totalLiquidToken, value: karuraTotalLiquidTokenValue } = await totalLiquidTokenTvl(karuraApi, karuraWallet);
  const { total: totalStakingTokenBridge, value: karuraTotalStakingTokenBridgeValue } = await stakingTokenBridgeTvl(karuraApi, karuraWallet);
  const karuraTotalLpTokenStaking = await lpTokenStakingTvl(karuraApi, karuraWallet);
  const karuraTotalLiquidityPool = await liquidityPoolTvl(karuraApi, karuraWallet)
  const karuraSwap = karuraTotalLiquidityPool.add(karuraTotalLpTokenStaking)
  console.log(`Total karuraSwap: ${karuraSwap.toString()} \n`);
  const karuraTotal = karuraStable.add(karuraTotalLiquidTokenValue).add(karuraTotalStakingTokenBridgeValue).add(karuraSwap)
  console.log(`Overall Tvl: ${karuraTotal.toString()}`);


  const acalaApi = await getApi('acala');
  const acalaWallet = new Wallet(acalaApi, {
    supportAUSD: true,
  });

  await acalaApi.isReady;
  console.log('acalaApi is ready');
  await acalaWallet.isReady;
  console.log('acalaWallet is ready');

  const acalaStable = await stableCoin(acalaApi, acalaWallet);
  const { total: karuraTotalLiquidToken, value: acalaTotalLiquidTokenValue } = await totalLiquidTokenTvl(acalaApi, acalaWallet);
  const { total: karuraTotalStakingTokenBridge, value: acalaTotalStakingTokenBridgeValue } = await stakingTokenBridgeTvl(acalaApi, acalaWallet);
  const acalaTotalLpTokenStaking = await lpTokenStakingTvl(acalaApi, acalaWallet);
  const acalaTotalLiquidityPool = await liquidityPoolTvl(acalaApi, acalaWallet)
  const {total: lcdot, value: lcdotValue} = await lcdotTvl(acalaWallet);
  const acalaSwap = acalaTotalLiquidityPool.add(acalaTotalLpTokenStaking)
  console.log(`Total acalaSwap: ${acalaSwap.toString()} \n`);
  const acalaTotal = acalaStable.add(acalaTotalLiquidTokenValue).add(acalaTotalStakingTokenBridgeValue).add(acalaSwap).add(lcdotValue)
  console.log(`Overall Tvl: ${acalaTotal.toString()}`);
};

main();
