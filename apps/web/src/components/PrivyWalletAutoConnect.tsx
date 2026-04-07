"use client";

import { useEffect, useRef } from "react";
import { getEmbeddedConnectedWallet } from "@privy-io/react-auth";
import { useAccount } from "wagmi";
import { useAppActiveWallet, useAppPrivy, useAppWallets, usePrivyBypassMode } from "@/hooks/usePrivyCompat";

/**
 * After email/social login, Privy may create an embedded wallet before wagmi reports `connected`.
 * Activating that wallet for wagmi fixes a stuck navbar state before the address appears.
 */
export function PrivyWalletAutoConnect() {
  const bypass = usePrivyBypassMode();
  const { authenticated, ready: privyReady } = useAppPrivy();
  const { wallets, ready: walletsReady } = useAppWallets();
  const { setActiveWallet, connect } = useAppActiveWallet();
  const { isConnected } = useAccount();
  const connectAttempted = useRef(false);

  useEffect(() => {
    if (bypass) return;
    if (!privyReady || !authenticated || !walletsReady || isConnected) return;

    const embedded = getEmbeddedConnectedWallet(wallets);
    if (embedded) {
      try {
        setActiveWallet(embedded);
      } catch {
        /* ignore */
      }
      return;
    }

    const eth = wallets.find((w: { chainType?: string }) => w.chainType === "ethereum");
    if (eth) {
      try {
        setActiveWallet(eth);
      } catch {
        /* ignore */
      }
      return;
    }

    if (connectAttempted.current) return;
    connectAttempted.current = true;
    void connect().catch(() => {
      connectAttempted.current = false;
    });
  }, [bypass, privyReady, authenticated, walletsReady, isConnected, wallets, setActiveWallet, connect]);

  return null;
}
