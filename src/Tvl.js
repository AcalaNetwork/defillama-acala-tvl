const { Token, FixedPointNumber } = require("@acala-network/sdk-core");
const {
  tokenAmountToHuman,
  crowdloanDotToDot,
  getLiquidCrowdloanPrice,
} = require("./utils");
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
};

class Tvl {
  #api;
  #chain;
  #tvl;

  constructor(api) {
    this.#api = api;
    this.#tvl = new Map();

    this.#chain =
      api.consts.system.ss58Prefix.toNumber() === 10 ? "acala" : "karura";
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

  addByCurrencyId(currencyId, amount) {
    amount = new FixedPointNumber(amount);
    // Workaround for typo in acala.js
    if (currencyId["LiquidCrowdloan"]) {
      currencyId = {
        liquidcroadloan: currencyId["LiquidCrowdloan"],
      };
    }

    const token = Token.fromCurrencyId(
      this.#api.createType("CurrencyId", currencyId)
    );

    if (this.#tvl.has(token.symbol)) {
      this.#tvl.set(token.symbol, this.#tvl.get(token.symbol).add(amount));
    } else {
      this.#tvl.set(token.symbol, amount);
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
          crowdloanDotToDot(this.#api, await this.#getCurrentRelayChainBlock())
        );
      }

      const humanAmount = await tokenAmountToHuman(
        this.#api,
        this.#chain,
        symbol,
        amount
      );

      if (geko[coinGekoNetworkName]) {
        geko[coinGekoNetworkName] += humanAmount;
      } else {
        geko[coinGekoNetworkName] = humanAmount;
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
