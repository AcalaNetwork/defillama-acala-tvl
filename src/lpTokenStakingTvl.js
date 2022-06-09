const { FixedPointNumber, forceToCurrencyName } = require("@acala-network/sdk-core");

const lpTokenStakingTvl = async (api, wallet) => {
  const data = await api.query.rewards.poolInfos.entries();
  let total = FixedPointNumber.ZERO;
  const filterData = data.filter((item) => {
    const [token] = item;

    return token.toHuman()[0].hasOwnProperty('Dex');
  });

  for (let i = 0; i < filterData.length; i++) {
    const [token, amount] = filterData[i];

    const lpToken = await wallet.getToken(forceToCurrencyName(token.args[0].asDex));
    const totalShares = FixedPointNumber.fromInner(amount.totalShares.toString(), lpToken.decimals);
    const price = await wallet.getPrice(lpToken.name);

    total = total.add(totalShares.times(price));
  }

  console.log(`LP Token Staking TVL: ${total.toString()} \n`)

  return total;
}

module.exports = {
  lpTokenStakingTvl
}