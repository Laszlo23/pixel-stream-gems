import { createConfig } from "@privy-io/wagmi";
import { http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { gemsWagmiChains } from "@/lib/chains/gemsWagmiChains";
import { zgGalileoTestnet } from "@/lib/chains/zgGalileo";

/** Optional Alchemy / Infura URLs — improves reliability vs public RPCs in production. */
const baseRpc = process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL?.trim();
const baseSepoliaRpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL?.trim();
const zgRpc = process.env.NEXT_PUBLIC_ZG_RPC_URL?.trim();

const baseTransports = {
  [base.id]: http(baseRpc),
  [baseSepolia.id]: http(baseSepoliaRpc),
};

export const wagmiConfig = createConfig({
  chains: gemsWagmiChains,
  transports:
    process.env.NEXT_PUBLIC_0G_CHAIN_ENABLED === "1"
      ? { ...baseTransports, [zgGalileoTestnet.id]: http(zgRpc) }
      : baseTransports,
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
