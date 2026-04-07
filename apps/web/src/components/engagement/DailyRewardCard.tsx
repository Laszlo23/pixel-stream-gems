"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Loader2 } from "lucide-react";
import {
  fetchEngagementChallenge,
  fetchRewardsStatus,
  isEngagementApiConfigured,
  postDailyClaim,
} from "@/lib/engagementApi";

export function DailyRewardCard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [streak, setStreak] = useState(0);
  const [canClaim, setCanClaim] = useState(true);
  const [serverXp, setServerXp] = useState(0);
  const [lastClaim, setLastClaim] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isConnected || !address || !isEngagementApiConfigured()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const s = await fetchRewardsStatus(address);
    if (s) {
      setStreak(s.streak);
      setCanClaim(s.canClaimToday);
      setServerXp(s.serverXp);
      setLastClaim(s.lastClaimOn);
    }
    setLoading(false);
  }, [address, isConnected]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onClaim = async () => {
    if (!address || !isEngagementApiConfigured()) return;
    setClaiming(true);
    try {
      const ch = await fetchEngagementChallenge(address, chainId, "daily_claim");
      if (!ch?.message) {
        toast.error("Could not start daily claim");
        return;
      }
      const signature = await signMessageAsync({ message: ch.message });
      const out = await postDailyClaim(ch.message, signature);
      if (!out) {
        toast.error("Claim failed — check API and signature");
        return;
      }
      if (out.alreadyClaimed) {
        toast.message("Already claimed today", { description: `Streak: ${out.streak} days` });
      } else {
        toast.success("Daily reward claimed", {
          description: `+${out.xpAwarded} XP · ${out.streak}-day streak`,
        });
      }
      setStreak(out.streak);
      setServerXp(out.serverXp);
      setCanClaim(false);
      setLastClaim(new Date().toISOString().slice(0, 10));
    } catch (e) {
      console.warn(e);
      toast.error("Wallet signature cancelled or failed");
    } finally {
      setClaiming(false);
      void refresh();
    }
  };

  if (!isEngagementApiConfigured()) {
    return (
      <Card className="rounded-2xl border-border/80 glass-panel border-dashed">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[hsl(var(--gold))]" />
            Daily reward
          </CardTitle>
          <CardDescription className="text-xs">
            Set <span className="font-mono">NEXT_PUBLIC_API_URL</span> to your Gems API to enable server streaks and XP.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!isConnected) return null;

  return (
    <Card className="rounded-2xl border-border/80 glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-[hsl(var(--gold))]" />
          Daily reward
        </CardTitle>
        <CardDescription className="text-xs">
          Sign once per day (UTC) to grow your streak and earn bonus XP on the server.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading status…
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">{streak}</p>
                <p className="text-[10px] text-muted-foreground">days</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Server XP</p>
                <p className="text-2xl font-bold tabular-nums text-gradient">{serverXp.toLocaleString()}</p>
              </div>
              {lastClaim && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last claim</p>
                  <p className="text-sm font-mono text-foreground">{lastClaim}</p>
                </div>
              )}
            </div>
            <Button
              type="button"
              className="rounded-xl w-full sm:w-auto"
              disabled={!canClaim || claiming}
              onClick={() => void onClaim()}
            >
              {claiming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing…
                </>
              ) : canClaim ? (
                "Claim today’s reward"
              ) : (
                "Come back tomorrow (UTC)"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
