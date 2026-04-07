"use client";

import { useEffect, useMemo } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { agentSkillMarketAbi, contractAddresses } from "@/lib/contracts";

function envBigint(key: string, fallback = 0n): bigint {
  const v = process.env[key]?.trim();
  if (!v) return fallback;
  try {
    return BigInt(v);
  } catch {
    return fallback;
  }
}

const AGENT_ID = envBigint("NEXT_PUBLIC_AGENT_SKILL_MARKET_AGENT_ID");
const SKILL_ID = envBigint("NEXT_PUBLIC_AGENT_SKILL_MARKET_SKILL_ID");

/**
 * Buy one inference credit pack on-chain (Base / Base Sepolia). Server can require
 * `purchases(wallet, agentId, skillId) > 0` when PRESENTER_REQUIRE_ASM_PURCHASE=1.
 */
export function AgentSkillPurchaseCard() {
  const market = contractAddresses.agentSkillMarket;
  const { address, isConnected, chainId } = useAccount();
  const { data: skill, isLoading: skillLoading } = useReadContract({
    address: market,
    abi: agentSkillMarketAbi,
    functionName: "skills",
    args: [AGENT_ID, SKILL_ID],
    query: { enabled: Boolean(market) },
  });

  const { data: purchaseCount, refetch: refetchPurchases } = useReadContract({
    address: market,
    abi: agentSkillMarketAbi,
    functionName: "purchases",
    args: address ? [address, AGENT_ID, SKILL_ID] : undefined,
    query: { enabled: Boolean(market && address) },
  });

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();

  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const priceWei =
    skill === undefined
      ? undefined
      : Array.isArray(skill)
        ? (skill[0] as bigint)
        : (skill as { priceWei: bigint }).priceWei;
  const active =
    skill === undefined
      ? undefined
      : Array.isArray(skill)
        ? (skill[1] as boolean)
        : (skill as { active: boolean }).active;

  const canBuy = useMemo(() => {
    return Boolean(market && isConnected && active && priceWei && priceWei > 0n);
  }, [market, isConnected, active, priceWei]);

  const onBuy = () => {
    if (!market || !priceWei || !active) return;
    reset();
    writeContract(
      {
        address: market,
        abi: agentSkillMarketAbi,
        functionName: "buySkill",
        args: [AGENT_ID, SKILL_ID],
        value: priceWei,
      },
      {
        onError: (e) => {
          console.warn(e);
          toast.error("Purchase failed", { description: e.message.slice(0, 120) });
        },
      },
    );
  };

  useEffect(() => {
    if (!isSuccess) return;
    toast.success("Purchase recorded on-chain");
    void refetchPurchases();
  }, [isSuccess, refetchPurchases]);

  if (!market) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-3">
      <div>
        <p className="text-sm font-medium text-foreground">Presenter AI credits (Base)</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Pay ETH on Base Sepolia for <code className="text-[11px]">AgentSkillMarket</code>. When the API enforces purchase checks, sign in with the same wallet and include SIWE on
          presenter requests.
        </p>
      </div>
      {!isConnected && <p className="text-xs text-muted-foreground">Connect your wallet (Base Sepolia) to buy.</p>}
      {isConnected && (
        <p className="text-xs text-muted-foreground">
          Your purchases:{" "}
          <span className="text-foreground font-mono">{purchaseCount !== undefined ? String(purchaseCount) : "…"}</span>
          {chainId === 84532 ? null : (
            <span className="block mt-1 text-amber-600/90">Switch to Base Sepolia (84532) to buy.</span>
          )}
        </p>
      )}
      {skillLoading ? (
        <p className="text-xs text-muted-foreground">Loading skill price…</p>
      ) : !active ? (
        <p className="text-xs text-amber-600/90">This skill is not active on-chain yet (platform must setSkill).</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Price: <span className="font-mono text-foreground">{priceWei ? `${priceWei} wei` : "—"}</span>
        </p>
      )}
      {error ? <p className="text-xs text-destructive">{error.message.slice(0, 160)}</p> : null}
      <Button
        type="button"
        size="sm"
        className="rounded-xl"
        disabled={!canBuy || isPending || confirming}
        onClick={onBuy}
      >
        {isPending || confirming ? "Confirm in wallet…" : "Buy skill (ETH)"}
      </Button>
    </div>
  );
}
