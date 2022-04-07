const Tvl = require("./Tvl");
const { gql, request } = require("graphql-request");
const { FixedPointNumber } = require("@acala-network/sdk-core");

const tvl = async (chain) => {
  const totalTvl = new Tvl(chain);

  const query = gql`
    query {
      collaterals {
        nodes {
          id
          decimals
          depositAmount
        }
      }
    }
  `;

  const endpoint =
    chain === "acala"
      ? "https://api.subquery.network/sq/AcalaNetwork/acala-loans"
      : "https://api.subquery.network/sq/AcalaNetwork/karura-loan";

  try {
    const data = await request(endpoint, query);

    data.collaterals.nodes.forEach(({ id, decimals, depositAmount }) => {
      const tokenAmount = new FixedPointNumber(depositAmount).div(
        new FixedPointNumber(10 ** decimals)
      );

      totalTvl.addToken(id, tokenAmount);
    });
  } catch (_e) {
    console.error("Could not fetch data");
  }

  return await totalTvl.getCoingeko();
};

module.exports = {
  methodology: "Counts collateral in lending market",
  tvl,
};
