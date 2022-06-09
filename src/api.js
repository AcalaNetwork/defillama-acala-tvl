const { ApiPromise, WsProvider } = require("@polkadot/api");
const { options } = require("@acala-network/api");

const POLKADOT_ENDPOINTS = [
  "wss://polkadot-rpc.dwellir.com",
  "wss://polkadot.api.onfinality.io/public-ws",
  "wss://rpc.polkadot.io",
];

const KUSAMA_ENDPOINTS = [
  "wss://kusama-rpc.polkadot.io",
  "wss://kusama.api.onfinality.io/public-ws",
  "wss://kusama-rpc.dwellir.com",
];

const ACALA_ENDPOINTS = [
  "wss://acala-rpc-0.aca-api.network",
  "wss://acala-rpc-1.aca-api.network",
  "wss://acala-rpc-3.aca-api.network/ws",
];

const KARURA_ENDPOINTS = [
  "wss://karura.api.onfinality.io/public-ws"
];

const getApi = async (chainName) => {
  let apiOptions;

  if (chainName === "acala") {
    apiOptions = options({ provider: new WsProvider(ACALA_ENDPOINTS) });
  } else if (chainName === "karura") {
    apiOptions = options({ provider: new WsProvider(KARURA_ENDPOINTS) });
  } else if (chainName === "polkadot") {
    apiOptions = { provider: new WsProvider(POLKADOT_ENDPOINTS) };
  } else if (chainName === "kusama") {
    apiOptions = { provider: new WsProvider(KUSAMA_ENDPOINTS) };
  } else {
    throw `Invalid chain name: ${chainName}`;
  }

  return ApiPromise.create(apiOptions);
};

module.exports = { getApi };
