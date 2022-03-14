const { getApi } = require("./api");
const Tvl = require("./Tvl");

const tvl = async (chain) => {
  const api = await getApi(chain);
  const entries = await api.query.loans.positions.entries();

  const totalTvl = new Tvl(api);

  for (const [keys, position] of entries) {
    let [currencyId, _address] = keys.toHuman();

    let collateral = position.toJSON().collateral;

    totalTvl.addByCurrencyId(currencyId, collateral);
  }

  return await totalTvl.getCoingeko();
};

module.exports = {
  methodology: "Counts collateral in lending market",
  tvl,
};
