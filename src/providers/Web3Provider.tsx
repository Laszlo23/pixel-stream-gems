import type { ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";

const rkTheme = darkTheme({
  accentColor: "hsl(215 25% 55%)",
  accentColorForeground: "white",
  borderRadius: "large",
  fontStack: "system",
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider theme={rkTheme}>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
}
