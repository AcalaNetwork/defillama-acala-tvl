const { Token } = require("@acala-network/sdk-core");
const { FixedPointNumber } = require("@acala-network/sdk-core");

const ACALA_LEASE_BLOCK = 17_856_000;

const DECIMALS = {
  acala: {
    ACA: 12,
    AUSD: 12,
    DOT: 10,
    LDOT: 10,
    "lc://13": 10, // lcDOT
  },
  karura: {
    KUSD: 12,
    KAR: 12,
    KSM: 12,
    LKSM: 12,
    BNC: 12,
    VSKSM: 12,
    PHA: 12,
    KINT: 12,
    KBTC: 8,
    TAI: 12,
    "fa://0": 10, // RMRK
    "sa://0": 12, // taiKSM
  },
};

const getLiquidConversionRate = async (api) => {
  const liquidCurrencyId = api.consts.homa.liquidCurrencyId;

  const toBond = new FixedPointNumber(
    Number(await api.query.homa.toBondPool())
  );
  const bonded = new FixedPointNumber(
    Number((await api.query.homa.stakingLedgers(0)).toJSON().bonded)
  );

  const totalStaked = toBond.add(bonded);

  const voidLiquid = new FixedPointNumber(
    Number(await api.query.homa.totalVoidLiquid())
  );
  const totalActive = new FixedPointNumber(
    Number(await api.query.tokens.totalIssuance(liquidCurrencyId))
  );

  const totalIssued = voidLiquid.add(totalActive);

  return totalStaked.div(totalIssued);
};

const tokenAmountToHuman = async (api, chain, tokenSymbol, amount) => {
  let tokenDecimals = DECIMALS[chain][tokenSymbol];

  if (!tokenDecimals) {
    console.error(`Acala/Karura: No decimals entry for ${tokenSymbol}`);
  } else {
    if (tokenSymbol === "LKSM" || tokenSymbol === "LDOT") {
      amount = amount.mul(await getLiquidConversionRate(api));
      tokenDecimals = DECIMALS[chain][tokenSymbol.slice(1)];
    }

    return amount.div(new FixedPointNumber(10 ** tokenDecimals)).toNumber();
  }
};

const crowdloanDotToDot = (api, currentRelayBlockNumber) => {
  const rewardRatePerRelaychainBlock =
    api.consts.prices.rewardRatePerRelaychainBlock.toNumber() || 0;
  const leaseBlockNumber = ACALA_LEASE_BLOCK;
  const discount = FixedPointNumber.ONE.div(
    new FixedPointNumber(
      (1 + rewardRatePerRelaychainBlock / 10 ** 18) **
        Math.max(leaseBlockNumber - currentRelayBlockNumber, 0)
    )
  );

  return discount;
};

const currencyIdToToken = (api, currencyId) => {
  // Workaround for typo in acala.js
  if (currencyId["LiquidCrowdloan"]) {
    currencyId = {
      liquidcroadloan: currencyId["LiquidCrowdloan"],
    };
  }

  const _currencyId = api.createType("CurrencyId", currencyId);
  return Token.fromCurrencyId(_currencyId);
};

module.exports = {
  getLiquidConversionRate,
  tokenAmountToHuman,
  crowdloanDotToDot,
  currencyIdToToken,
};
