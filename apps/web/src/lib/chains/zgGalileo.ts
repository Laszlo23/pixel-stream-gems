import { defineChain } from "viem";

/** 0G Galileo testnet (EVM). See https://docs.0g.ai/ */
export const zgGalileoTestnet = defineChain({
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_ZG_RPC_URL?.trim() || "https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G Galileo Explorer", url: "https://chainscan-galileo.0g.ai" },
  },
});
