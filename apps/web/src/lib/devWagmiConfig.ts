import { createConfig, http } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
import { gemsWagmiChains } from "@/lib/chains/gemsWagmiChains";
import { zgGalileoTestnet } from "@/lib/chains/zgGalileo";

const baseRpc = process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL?.trim();
const baseSepoliaRpc = process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL?.trim();
const zgRpc = process.env.NEXT_PUBLIC_ZG_RPC_URL?.trim();

/**
 * Minimal wagmi config when Privy is bypassed (no NEXT_PUBLIC_PRIVY_APP_ID).
 */
const baseTransports = {
  [base.id]: http(baseRpc),
  [baseSepolia.id]: http(baseSepoliaRpc),
};

export const devWagmiConfig = createConfig({
  chains: gemsWagmiChains,
  connectors: [injected({ shimDisconnect: true })],
  transports:
    process.env.NEXT_PUBLIC_0G_CHAIN_ENABLED === "1"
      ? { ...baseTransports, [zgGalileoTestnet.id]: http(zgRpc) }
      : baseTransports,
  ssr: true,
});
