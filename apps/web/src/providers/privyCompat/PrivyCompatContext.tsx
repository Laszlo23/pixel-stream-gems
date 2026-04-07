"use client";

import { createContext, useContext, type ReactNode } from "react";

/** Shape consumed by UI via useAppPrivy / useAppWallets / useAppActiveWallet. */
export type PrivyCompatContextValue = {
  bypassMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  privy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wallets: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  activeWallet: any;
};

export const PrivyCompatContext = createContext<PrivyCompatContextValue | null>(null);

export function usePrivyCompat(): PrivyCompatContextValue {
  const ctx = useContext(PrivyCompatContext);
  if (!ctx) {
    throw new Error("Privy compat hooks require Web3Provider");
  }
  return ctx;
}

export function useAppPrivy() {
  return usePrivyCompat().privy;
}

export function useAppWallets() {
  return usePrivyCompat().wallets;
}

export function useAppActiveWallet() {
  return usePrivyCompat().activeWallet;
}

export function usePrivyBypassMode(): boolean {
  return usePrivyCompat().bypassMode;
}

export function PrivyCompatProvider({
  value,
  children,
}: {
  value: PrivyCompatContextValue;
  children: ReactNode;
}) {
  return <PrivyCompatContext.Provider value={value}>{children}</PrivyCompatContext.Provider>;
}
