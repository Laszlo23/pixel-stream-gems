import type { Chain } from "viem";
import { base, baseSepolia } from "wagmi/chains";
import { zgGalileoTestnet } from "./zgGalileo";

/** Base + Base Sepolia; adds 0G Galileo when NEXT_PUBLIC_0G_CHAIN_ENABLED=1 */
export const gemsWagmiChains = (
  process.env.NEXT_PUBLIC_0G_CHAIN_ENABLED === "1"
    ? [base, baseSepolia, zgGalileoTestnet]
    : [base, baseSepolia]
) as readonly [Chain, ...Chain[]];
