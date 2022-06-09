const { FixedPointNumber, forceToCurrencyName } = require("@acala-network/sdk-core");

const liquidityPoolTvl = async (api, wallet) => {
  const data = await api.query.dex.liquidityPool.entries();
  let total = FixedPointNumber.ZERO;

  for (let i = 0; i < data.length; i++) {
    const [token, amount] = data[i];
    const tokenA = await wallet.getToken(forceToCurrencyName(token.args[0][0]));
    const tokenB = await wallet.getToken(forceToCurrencyName(token.args[0][1]));
    const amountA = FixedPointNumber.fromInner(amount[0].toString(), tokenA.decimals);
    const amountB = FixedPointNumber.fromInner(amount[1].toString(), tokenB.decimals);
    const priceA = await wallet.getPrice(tokenA);
    const priceB = await wallet.getPrice(tokenB);

    if (!priceA || !priceB) return;

    total = total.add(amountA.times(priceA)).add(amountB.times(priceB));

  }

  console.log(`Liquidity Pool TVL: ${total.toString()} \n`)

  return total;
}

module.exports = {
  liquidityPoolTvl
}