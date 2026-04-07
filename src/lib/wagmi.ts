import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

// Get a free project id at https://cloud.walletconnect.com — required for WalletConnect / mobile wallets.
const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "00000000000000000000000000000000";

export const wagmiConfig = getDefaultConfig({
  appName: "Gems",
  projectId,
  chains: [base, baseSepolia],
  ssr: false,
});
