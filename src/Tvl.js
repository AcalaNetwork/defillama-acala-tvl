const { Token, FixedPointNumber } = require("@acala-network/sdk-core");
const { crowdloanDotToDot, getLiquidConversionRate } = require("./utils");
const { getApi } = require("./api");

const coingekoTokenToNetwork = {
  KAR: "karura",
  KUSD: "tether",
  KSM: "kusama",
  LKSM: "kusama",
  BNC: "bifrost-native-coin",
  VSKSM: "kusama",
  PHA: "pha",
  KINT: "kintsugi",
  KBTC: "bitcoin",
  ACA: "acala",
  AUSD: "tether",
  DOT: "polkadot",
  LDOT: "polkadot",
  "lc://13": "polkadot",
  "sa://0": "kusama",
  "fa://0": "rmrk",
  "fa://2": "quartz",
  "fa://5": "crust-shadow",
};

class Tvl {
  #api;
  #chain;
  #tvl;

  constructor(chain) {
    this.#tvl = new Map();

    this.#api = getApi(chain);
    this.#chain = chain;
  }

  async #getCurrentRelayChainBlock() {
    let relayChainApi;

    if (this.#chain === "acala") {
      relayChainApi = await getApi("polkadot");
    } else {
      relayChainApi = await getApi("kusama");
    }

    const blockNumber = (await relayChainApi.query.system.number()).toJSON();

    return blockNumber;
  }

  addToken(symbol, amount) {
    if (this.#tvl.has(symbol)) {
      this.#tvl.set(symbol, this.#tvl.get(symbol).add(amount));
    } else {
      this.#tvl.set(symbol, amount);
    }
  }

  async getCoingeko() {
    const geko = {};

    for (let [symbol, amount] of Array.from(this.#tvl.entries())) {
      const coinGekoNetworkName = coingekoTokenToNetwork[symbol];

      if (!coinGekoNetworkName) {
        console.error(`${symbol} does not have a network name`);
        continue;
      }

      if (symbol === "lc://13") {
        amount = amount.mul(
          crowdloanDotToDot(
            await this.#api,
            await this.#getCurrentRelayChainBlock()
          )
        );
      } else if (symbol === "LKSM" || symbol === "LDOT") {
        amount = amount.mul(await getLiquidConversionRate(await this.#api));
      }

      if (geko[coinGekoNetworkName]) {
        geko[coinGekoNetworkName] += amount.toNumber();
      } else {
        geko[coinGekoNetworkName] = amount.toNumber();
      }
    }

    if (Object.keys(geko).length === 0) {
      return {
        tether: 0,
      };
    }

    return geko;
  }
}

module.exports = Tvl;
