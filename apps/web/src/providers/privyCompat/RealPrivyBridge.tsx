"use client";

import { usePrivy, useWallets, useActiveWallet } from "@privy-io/react-auth";
import type { ReactNode } from "react";
import { PrivyCompatProvider } from "./PrivyCompatContext";

export function RealPrivyBridge({ children }: { children: ReactNode }) {
  const privy = usePrivy();
  const wallets = useWallets();
  const activeWallet = useActiveWallet();

  return (
    <PrivyCompatProvider
      value={{
        bypassMode: false,
        privy,
        wallets,
        activeWallet,
      }}
    >
      {children}
    </PrivyCompatProvider>
  );
}
