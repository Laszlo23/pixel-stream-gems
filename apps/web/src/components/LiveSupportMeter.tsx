"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Loader2, Pause, Play, Waves } from "lucide-react";
import { ethers } from "ethers";
import { Framework, getPerSecondFlowRateByMonth } from "@superfluid-finance/sdk-core";
import { useAppWallets } from "@/hooks/usePrivyCompat";
import { useAccount, useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { contractAddresses } from "@/lib/contracts";
import { resolveSuperfluidProtocolSubgraphUrl } from "@/lib/superfluidConfig";

export interface ActiveStream {
  id: string;
  supporter: string;
  rateLabel: string;
  flowPerHourUsd: number;
}

const FLOW_PRESETS = [
  { id: "p05", label: "$0.05 / min", flowPerHourUsd: 3 },
  { id: "p10", label: "$0.10 / min", flowPerHourUsd: 6 },
  { id: "h1", label: "$1 / hr", flowPerHourUsd: 1 },
  { id: "h5", label: "$5 / hr", flowPerHourUsd: 5 },
] as const;

const demoStreams: ActiveStream[] = [
  { id: "1", supporter: "orbit.eth", rateLabel: "$0.05 / min", flowPerHourUsd: 3 },
  { id: "2", supporter: "lumen.base", rateLabel: "$1 / hr", flowPerHourUsd: 1 },
  { id: "3", supporter: "fan_42", rateLabel: "$0.10 / min", flowPerHourUsd: 6 },
];

interface LiveSupportMeterProps {
  creatorName: string;
  tokenSymbol: string;
  /** Creator receive address for Superfluid flows (EOA or contract). */
  flowReceiver?: `0x${string}`;
  className?: string;
}

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function LiveSupportMeter({
  creatorName,
  tokenSymbol,
  flowReceiver: flowReceiverProp,
  className,
}: LiveSupportMeterProps) {
  const { address, isConnected } = useAccount();
  const { wallets } = useAppWallets();
  const chainId = useChainId();
  const [streaming, setStreaming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [presetId, setPresetId] = useState<(typeof FLOW_PRESETS)[number]["id"]>("p10");
  const [localStreams, setLocalStreams] = useState<ActiveStream[]>(demoStreams);
  const [subgraphUsdPerHr, setSubgraphUsdPerHr] = useState<number | null>(null);

  const superToken = process.env.NEXT_PUBLIC_SUPERFLUID_SUPER_TOKEN as `0x${string}` | undefined;
  const flowReceiver = (flowReceiverProp ??
    (process.env.NEXT_PUBLIC_DEFAULT_FLOW_RECEIVER as `0x${string}` | undefined)) as `0x${string}` | undefined;
  const subgraphUrl = resolveSuperfluidProtocolSubgraphUrl(chainId);
  /** Display: multiply token/hour by this for “$ / hr” (e.g. 1 for USDCx ≈ $1). */
  const usdPerTokenUnit = Number(process.env.NEXT_PUBLIC_SUPERFLUID_USD_PER_TOKEN ?? "1");

  const selectedPreset = FLOW_PRESETS.find((p) => p.id === presetId) ?? FLOW_PRESETS[1];

  const totalFlow = useMemo(() => {
    const demo = localStreams.reduce((a, s) => a + s.flowPerHourUsd, 0);
    if (subgraphUsdPerHr != null) return Math.max(demo, subgraphUsdPerHr);
    return demo;
  }, [localStreams, subgraphUsdPerHr]);

  const pollSubgraph = useCallback(async () => {
    if (!subgraphUrl || !flowReceiver) return;
    try {
      // Protocol-v1 subgraph: https://docs.superfluid.org/docs/sdk/money-streaming/subgraph
      const receiver = flowReceiver.toLowerCase();
      const tokenLc = superToken?.toLowerCase();
      const q = tokenLc
        ? `query($r:String!,$t:String!){ streams(where:{receiver:$r,token:$t}){ currentFlowRate token{ decimals } } }`
        : `query($r:String!){ streams(where:{receiver:$r}){ currentFlowRate token{ decimals } } }`;
      const variables = tokenLc ? { r: receiver, t: tokenLc } : { r: receiver };
      const res = await fetch(subgraphUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: q, variables }),
      });
      const json = (await res.json()) as {
        errors?: { message: string }[];
        data?: { streams?: { currentFlowRate: string; token?: { decimals: number } }[] };
      };
      if (json.errors?.length) {
        setSubgraphUsdPerHr(null);
        return;
      }
      const streams = json.data?.streams ?? [];
      let tokenUnitsPerHr = 0;
      for (const s of streams) {
        const dec = Number(s.token?.decimals ?? 18);
        const rate = BigInt(s.currentFlowRate || "0");
        tokenUnitsPerHr += Number(rate) / 10 ** dec * 3600;
      }
      const factor = Number.isFinite(usdPerTokenUnit) && usdPerTokenUnit > 0 ? usdPerTokenUnit : 1;
      const perHr = tokenUnitsPerHr * factor;
      if (!Number.isNaN(perHr)) setSubgraphUsdPerHr(perHr);
    } catch {
      setSubgraphUsdPerHr(null);
    }
  }, [subgraphUrl, flowReceiver, superToken, usdPerTokenUnit]);

  useEffect(() => {
    void pollSubgraph();
    const t = window.setInterval(() => void pollSubgraph(), 15_000);
    return () => window.clearInterval(t);
  }, [pollSubgraph]);

  const runSuperfluid = async (start: boolean) => {
    if (!isConnected || !address) {
      toast.message("Connect wallet", { description: "Connect a wallet to start a real Superfluid flow." });
      return;
    }
    if (!superToken || !flowReceiver) {
      toast.message("Configure Superfluid", {
        description: "Set NEXT_PUBLIC_SUPERFLUID_SUPER_TOKEN and NEXT_PUBLIC_DEFAULT_FLOW_RECEIVER.",
      });
      toggleDemoOnly(start);
      return;
    }
    setBusy(true);
    try {
      const match = (wallets as { type?: string; address: string; getEthereumProvider?: () => Promise<unknown> }[]).find(
        (w) => w.type === "ethereum" && w.address.toLowerCase() === address.toLowerCase(),
      );
      const injected = typeof window !== "undefined" ? (window as unknown as { ethereum?: unknown }).ethereum : undefined;
      const eip1193 =
        match && "getEthereumProvider" in match
          ? await (match as { getEthereumProvider: () => Promise<unknown> }).getEthereumProvider()
          : injected;
      if (!eip1193) {
        toast.error("No wallet provider");
        return;
      }
      const provider = new ethers.providers.Web3Provider(
        eip1193 as ethers.providers.ExternalProvider,
      );
      const signer = await provider.getSigner();
      const customSubgraphQueriesEndpoint = resolveSuperfluidProtocolSubgraphUrl(chainId);
      const sf = await Framework.create({
        chainId,
        provider,
        ...(customSubgraphQueriesEndpoint
          ? { customSubgraphQueriesEndpoint }
          : {}),
      });
      const st = await sf.loadSuperToken(superToken);
      const monthlyUsd = selectedPreset.flowPerHourUsd * 24 * 30;
      const flowRate = getPerSecondFlowRateByMonth(monthlyUsd.toFixed(6));
      if (start) {
        const op = st.createFlow({
          sender: await signer.getAddress(),
          receiver: flowReceiver,
          flowRate,
        });
        await op.exec(signer);
        toast.success("Flow started", { description: `Streaming ~${selectedPreset.label} to ${creatorName}.` });
        setStreaming(true);
        setLocalStreams((prev) => [
          ...prev.filter((x) => x.supporter !== "you"),
          {
            id: String(Date.now()),
            supporter: "you",
            rateLabel: selectedPreset.label,
            flowPerHourUsd: selectedPreset.flowPerHourUsd,
          },
        ]);
      } else {
        const op = st.deleteFlow({
          sender: await signer.getAddress(),
          receiver: flowReceiver,
        });
        await op.exec(signer);
        toast.success("Flow stopped");
        setStreaming(false);
        setLocalStreams((prev) => prev.filter((x) => x.supporter !== "you"));
      }
      void pollSubgraph();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Superfluid transaction failed";
      toast.error(msg);
      toggleDemoOnly(start);
    } finally {
      setBusy(false);
    }
  };

  const toggleDemoOnly = (start: boolean) => {
    setStreaming(start);
    if (start) {
      setLocalStreams((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          supporter: "you",
          rateLabel: selectedPreset.label,
          flowPerHourUsd: selectedPreset.flowPerHourUsd,
        },
      ]);
    } else {
      setLocalStreams((prev) => prev.filter((x) => x.supporter !== "you"));
    }
  };

  const onToggle = () => {
    if (streaming) void runSuperfluid(false);
    else void runSuperfluid(true);
  };

  return (
    <div
      id="live-support-meter"
      className={cn("lux-glass p-4 rounded-2xl space-y-4 border border-[rgba(255,43,85,0.15)]", className)}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Live Support Meter</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Superfluid money streaming on Base — flows to {creatorName}. Pair with {`$${tokenSymbol}`} pools; wrap
              underlying to Super Tokens first.
            </p>
            {flowReceiver && (
              <p className="text-[10px] text-muted-foreground mt-1 font-mono">Receiver: {shortAddr(flowReceiver)}</p>
            )}
            {contractAddresses.feeVault && (
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Fee vault: {shortAddr(contractAddresses.feeVault)}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant={streaming ? "secondary" : "default"}
          className="rounded-xl gap-1.5 shrink-0 self-start"
          disabled={busy}
          onClick={onToggle}
        >
          {busy ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : streaming ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Stop flow
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Start streaming support
            </>
          )}
        </Button>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Your flow rate</p>
        <div className="flex flex-wrap gap-2">
          {FLOW_PRESETS.map((p) => (
            <Button
              key={p.id}
              type="button"
              size="sm"
              variant={presetId === p.id ? "default" : "outline"}
              className="rounded-xl text-xs h-8"
              disabled={streaming || busy}
              onClick={() => setPresetId(p.id)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-secondary/50 border border-border/60 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Active flows</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">{localStreams.length}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 border border-border/60 p-3 sm:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Real-time income (est. / hr)</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-semibold tabular-nums text-foreground">${totalFlow.toFixed(1)}</p>
            <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-primary" />
              live
            </span>
          </div>
          <Progress value={Math.min(100, totalFlow * 4)} className="h-1.5 mt-2" />
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Top supporters (by flow)</p>
        <ul className="space-y-2">
          {localStreams
            .slice()
            .sort((a, b) => b.flowPerHourUsd - a.flowPerHourUsd)
            .map((s, i) => (
              <li
                key={s.id}
                className="flex items-center justify-between text-xs rounded-xl bg-muted/30 px-3 py-2 border border-border/50"
              >
                <span className="text-muted-foreground w-5">{i + 1}</span>
                <span className="flex-1 font-medium text-foreground truncate px-2">{s.supporter}</span>
                <span className="text-primary tabular-nums shrink-0">{s.rateLabel}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
