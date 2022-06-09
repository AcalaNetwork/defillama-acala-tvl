const { FixedPointNumber, forceToCurrencyName } = require("@acala-network/sdk-core");

const stableCoin = async (api, wallet) => {
  let locked = FixedPointNumber.ZERO;

  const data = await api.query.loans.totalPositions.entries();

  for (let i = 0; i < data.length; i++) {
    const [_token, amount] = data[i];
    const token = await wallet.getToken(forceToCurrencyName(_token.args[0]));
    const collateral = FixedPointNumber.fromInner(amount.collateral.toString(), token.decimals);
    const price = await wallet.getPrice(token.name);

    locked = locked.add(collateral.times(price));
  }

  console.log(`Stablecoin Tvl: ${locked.toString()} \n`)
  return locked;
}

module.exports = {
  stableCoin
}