"use client";

import { useMemo, type ReactNode } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { PrivyCompatProvider } from "./PrivyCompatContext";

export function BypassPrivyBridge({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const value = useMemo(() => {
    const pickConnector = () =>
      connectors.find((c) => c.id === "injected" || c.type === "injected") ?? connectors[0];

    const connectInjected = async () => {
      const c = pickConnector();
      if (!c) return;
      await connectAsync({ connector: c });
    };

    return {
      bypassMode: true,
      privy: {
        ready: true,
        authenticated: isConnected,
        user: null,
        login: () => void connectInjected().catch(() => {}),
        logout: () => void disconnectAsync().catch(() => {}),
        linkWallet: () => void connectInjected().catch(() => {}),
      },
      wallets: {
        ready: true,
        wallets: [],
      },
      activeWallet: {
        wallet: address ? { address } : null,
        setActiveWallet: () => {},
        connect: connectInjected,
      },
    };
  }, [isConnected, address, connectAsync, disconnectAsync, connectors]);

  return <PrivyCompatProvider value={value}>{children}</PrivyCompatProvider>;
}
