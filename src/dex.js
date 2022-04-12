const Tvl = require("./Tvl");
const { gql, request } = require("graphql-request");
const { getApi } = require("./api");
const { FixedPointNumber } = require("@acala-network/sdk-core");

const tvl = async (chain) => {
  const totalTvl = new Tvl(chain);

  const query = gql`
    query {
      tokens {
        nodes {
          id
          decimals
          amount
        }
      }
    }
  `;

  const endpoint =
    chain === "acala"
      ? "https://api.subquery.network/sq/AcalaNetwork/acala-dex"
      : "https://api.subquery.network/sq/AcalaNetwork/karura-dex";

  try {
    const data = await request(endpoint, query);

    data.tokens.nodes.forEach(({ id, decimals, amount }) => {
      if (id.startsWith("lp")) {
        return;
      }

      const tokenAmount = new FixedPointNumber(amount).div(
        new FixedPointNumber(10 ** decimals)
      );

      totalTvl.addToken(id, tokenAmount);
    });
  } catch (_e) {
    console.error(`Could not fetch ${chain} dex data`);
  }

  return await totalTvl.getCoingeko();
};

module.exports = {
  methodology: "Counts tokens in liquidity pools",
  tvl,
};
