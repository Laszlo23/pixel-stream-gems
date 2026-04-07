"use client";

import { useMemo, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider as PrivyWagmiProvider } from "@privy-io/wagmi";
import { WagmiProvider } from "wagmi";
import type { State } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi-config";
import { devWagmiConfig } from "@/lib/devWagmiConfig";
import { buildPrivyClientConfig } from "@/lib/privyAppConfig";
import { shouldUsePrivyBypass } from "@/lib/privyBypass";
import { RealPrivyBridge } from "@/providers/privyCompat/RealPrivyBridge";
import { BypassPrivyBridge } from "@/providers/privyCompat/BypassPrivyBridge";

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim() ?? "";

function usePrivyClientConfig() {
  return useMemo(() => buildPrivyClientConfig(), []);
}

/**
 * Privy path: PrivyProvider → QueryClient → @privy-io/wagmi WagmiProvider → RealPrivyBridge.
 * Bypass: no Privy — QueryClient → wagmi WagmiProvider → BypassPrivyBridge (injected wallet only).
 */
export function Web3Provider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State | undefined;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const privyConfig = usePrivyClientConfig();
  const bypass = shouldUsePrivyBypass();

  if (bypass) {
    return (
      <QueryClientProvider client={queryClient}>
        <WagmiProvider
          config={devWagmiConfig as unknown as typeof wagmiConfig}
          initialState={initialState}
        >
          <BypassPrivyBridge>{children}</BypassPrivyBridge>
        </WagmiProvider>
      </QueryClientProvider>
    );
  }

  if (!privyAppId) {
    throw new Error("NEXT_PUBLIC_PRIVY_APP_ID is required when Privy bypass is off");
  }

  return (
    <PrivyProvider appId={privyAppId} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <PrivyWagmiProvider config={wagmiConfig} initialState={initialState}>
          <RealPrivyBridge>{children}</RealPrivyBridge>
        </PrivyWagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
