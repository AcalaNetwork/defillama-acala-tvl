const Tvl = require("./Tvl");
const { getApi } = require("./api");
const { FixedPointNumber } = require("@acala-network/sdk-core");

const tvl = async (chain) => {
  const api = await getApi(chain);
  const totalTvl = new Tvl(chain);

  const ledgers = await api.query.homa.stakingLedgers.entries();

  for (const [_key, ledger] of ledgers) {
    const bonded = ledger.toJSON().bonded;

    if (chain === "acala") {
      totalTvl.addToken(
        "DOT",
        new FixedPointNumber(bonded).div(new FixedPointNumber(10 ** 10))
      );
    } else {
      totalTvl.addToken(
        "KSM",
        new FixedPointNumber(bonded).div(new FixedPointNumber(10 ** 12))
      );
    }
  }

  return await totalTvl.getCoingeko();
};

module.exports = {
  methodology: "Counts tokens in liquid staking protocol",
  tvl,
};
