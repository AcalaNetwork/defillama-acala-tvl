

const lcdotTvl = async (wallet) => {
  const supply = await wallet.getIssuance('lc://13')
  const price = await wallet.getPrice('DOT');

  console.log(`LCDOT TVL: `, supply.toString());
  console.log(`LCDOT Value: `, supply.times(price).toString(), '\n');

  return  {
    total: supply,
    value: supply.times(price)
  }
};

module.exports = {
  lcdotTvl
}