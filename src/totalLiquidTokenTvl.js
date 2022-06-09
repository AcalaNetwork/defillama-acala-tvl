const { FixedPointNumber } = require("@acala-network/sdk-core");

const getTotalStaking = async (api, token) => {
  const toBond = await api.query.homa.toBondPool();
  const stakingLedgers = await api.query.homa.stakingLedgers.entries();
  let totalInSubAccount = FixedPointNumber.ZERO;

  stakingLedgers.map(item => {
    const ledge = item[1].unwrapOrDefault();
    totalInSubAccount = totalInSubAccount.add(FixedPointNumber.fromInner(ledge.bonded.unwrap().toString(), token.decimals));
  })

  const total = FixedPointNumber.fromInner(toBond.toString(), token.decimals).add(totalInSubAccount);

  return total;
}

const totalLiquidTokenTvl = async (api, wallet) => {
  const getStakingCurrencyId = api.consts.prices.getStakingCurrencyId;
  const stakingToken = await wallet.getToken(getStakingCurrencyId);
  const price = await wallet.getPrice(stakingToken);
  
  const total = await getTotalStaking(api, stakingToken)
  const value = total.times(price);

  console.log(`Total Liquid ${stakingToken.display} TVL: `, total.toString());
  console.log(`Total Liquid ${stakingToken.display} Value: `, value.toString(), '\n');

  return {
    total,
    value
  }
}

module.exports = {
  totalLiquidTokenTvl,
  getTotalStaking
}