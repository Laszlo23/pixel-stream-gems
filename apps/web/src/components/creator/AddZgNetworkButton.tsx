"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ZG_CHAIN_PARAMS = [
  {
    chainId: "0x40ea",
    chainName: "0G-Galileo-Testnet",
    nativeCurrency: { name: "0G", symbol: "0G", decimals: 18 },
    rpcUrls: ["https://evmrpc-testnet.0g.ai"],
    blockExplorerUrls: ["https://chainscan-galileo.0g.ai"],
  },
] as const;

export function AddZgNetworkButton() {
  const [busy, setBusy] = useState(false);

  const add = async () => {
    const eth = typeof window !== "undefined" ? window.ethereum : undefined;
    if (!eth?.request) {
      toast.error("No wallet", { description: "Install a browser wallet or use Privy." });
      return;
    }
    setBusy(true);
    try {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [...ZG_CHAIN_PARAMS],
      });
      toast.success("0G Galileo testnet added", {
        description: "Fund this wallet with testnet 0G for ledger deposits (see 0G docs).",
      });
    } catch (e) {
      console.warn(e);
      toast.error("Could not add network", { description: "You may have dismissed the wallet prompt." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button type="button" variant="secondary" size="sm" className="rounded-xl" disabled={busy} onClick={() => void add()}>
      {busy ? "Adding…" : "Add 0G Galileo testnet to wallet"}
    </Button>
  );
}
