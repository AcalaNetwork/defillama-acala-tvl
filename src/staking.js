const Tvl = require("./Tvl");
const { getApi } = require("./api");

const tvl = async (chain) => {
  const api = await getApi(chain);
  const totalTvl = new Tvl(api);

  const ledgers = await api.query.homa.stakingLedgers.entries();

  for (const [_key, ledger] of ledgers) {
    const bonded = ledger.toJSON().bonded;

    if (chain === "acala") {
      totalTvl.addByCurrencyId({ Token: "DOT" }, bonded);
    } else {
      totalTvl.addByCurrencyId({ Token: "KSM" }, bonded);
    }
  }

  return await totalTvl.getCoingeko();
};

module.exports = {
  methodology: "Counts tokens in liquid staking protocol",
  tvl,
};
