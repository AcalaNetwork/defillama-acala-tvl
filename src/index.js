const CoinGecko = require("coingecko-api");
const loans = require("./loans");
const dex = require("./dex");
const staking = require("./staking");
const { getApi } = require("./api");
const Tvl = require("./Tvl");

const CoinGeckoClient = new CoinGecko();

const getPrices = async (tokens) => {
  try {
    const res = await CoinGeckoClient.simple.price({
      ids: Object.keys(tokens),
      vs_currencies: ["usd"],
    });

    if (res.success) {
      const prices = res.data;

      const totalTvl = Object.entries(prices)
        .map(([token, { usd: price }]) => {
          return tokens[token] * price;
        })
        .reduce((total, tokenPrice) => {
          return total + tokenPrice;
        }, 0);

      return totalTvl.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    }
  } catch (e) {
    console.error(e);
    return "ERROR";
  }
};

const main = async () => {
  console.log("Acala TVL:");

  const acalaLoansTvl = await loans.tvl("acala");
  console.log(`${loans.methodology}:\n`, await getPrices(acalaLoansTvl));

  const acalaDexTvl = await dex.tvl("acala");
  console.log(`${dex.methodology}:\n`, await getPrices(acalaDexTvl));

  const acalaStakingTvl = await staking.tvl("acala");
  console.log(`${staking.methodology}:\n`, await getPrices(acalaStakingTvl));

  console.log("Karura TVL:");

  const karuraLoansTvl = await loans.tvl("karura");
  console.log(`${loans.methodology}:\n`, await getPrices(karuraLoansTvl));

  const karuraDexTvl = await dex.tvl("karura");
  console.log(`${dex.methodology}:\n`, await getPrices(karuraDexTvl));

  const karuraStakingTvl = await staking.tvl("karura");
  console.log(`${staking.methodology}:\n`, await getPrices(karuraStakingTvl));

  process.exit(0);
};

main();
