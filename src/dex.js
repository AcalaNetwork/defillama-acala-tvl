const Tvl = require("./Tvl");
const { getApi } = require("./api");

const tvl = async (chain) => {
  const api = await getApi(chain);
  const totalTvl = new Tvl(api);

  const dexPools = await api.query.dex.liquidityPool.entries();

  for (const [pair, numTokens] of dexPools) {
    const [tokenA, tokenB] = pair.toHuman()[0];

    const _numTokens = numTokens.toJSON();

    totalTvl.addByCurrencyId(tokenA, _numTokens[0]);
    totalTvl.addByCurrencyId(tokenB, _numTokens[1]);
  }

  if (api.query.stableAsset) {
    const stablePools = await api.query.stableAsset.pools.entries();
    for ([_key, pool] of stablePools) {
      const poolInfo = pool.toJSON();
      const assets = poolInfo.assets;
      const balances = poolInfo.balances;

      for (const assetIndex in assets) {
        const currencyId = assets[assetIndex];
        const assetBalance = balances[assetIndex];

        totalTvl.addByCurrencyId(currencyId, assetBalance);
      }
    }
  }

  return await totalTvl.getCoingeko();
};

module.exports = {
  methodology: "Counts tokens in liquidity pools",
  tvl,
};
