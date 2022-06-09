const { getTotalStaking } = require("./totalLiquidTokenTvl");

const stakingTokenBridgeTvl = async (api, wallet) => {
  const getStakingCurrencyId = api.consts.prices.getStakingCurrencyId;
  const token = await wallet.getToken(getStakingCurrencyId);

  const price = await wallet.getPrice(token);

  const supply = await wallet.getIssuance(token);
  const supplyValue = supply.times(price);

  const total = await getTotalStaking(api, token);
  const stakingValue = total.times(price);

  console.log(`StakingToken Bridge TVL: `, total.add(supply).toString());
  console.log(`StakingToken Bridge Value: `, supplyValue.add(stakingValue).toString(), '\n');

  return  {
    total: total.add(supply),
    value: supplyValue.add(stakingValue)
  }
};

module.exports = {
  stakingTokenBridgeTvl
}