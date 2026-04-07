"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, Loader2 } from "lucide-react";
import {
  fetchEngagementChallenge,
  fetchRewardsStatus,
  isEngagementApiConfigured,
  postGrowthComplete,
  type EngagementIntent,
} from "@/lib/engagementApi";

type TaskRow = {
  id: string;
  label: string;
  hint: string;
  intent: EngagementIntent;
  taskKey: string;
};

const TASKS: TaskRow[] = [
  {
    id: "invite",
    label: "Copy your invite link",
    hint: "Use the card below, then sign here to record the task.",
    intent: "growth_invite_copied",
    taskKey: "invite_link_copied",
  },
  {
    id: "room",
    label: "Share a live room",
    hint: "Pick a show from Discover, share the URL, then sign to log the habit.",
    intent: "growth_room_share",
    taskKey: "room_share_intent",
  },
];

export function GrowthTasksCard() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isConnected || !address || !isEngagementApiConfigured()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const s = await fetchRewardsStatus(address);
    if (s) setDone(new Set(s.growthCompleted));
    setLoading(false);
  }, [address, isConnected]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signTask = async (intent: EngagementIntent) => {
    if (!address) return;
    setBusy(intent);
    try {
      const ch = await fetchEngagementChallenge(address, chainId, intent);
      if (!ch?.message) {
        toast.error("Could not start task");
        return;
      }
      const signature = await signMessageAsync({ message: ch.message });
      const out = await postGrowthComplete(ch.message, signature, intent);
      if (!out) {
        toast.error("Task failed");
        return;
      }
      if (out.alreadyDone) toast.message("Task already completed");
      else toast.success("Growth task recorded", { description: `+${out.xpAwarded} server XP` });
      void refresh();
    } catch (e) {
      console.warn(e);
      toast.error("Signature cancelled or failed");
    } finally {
      setBusy(null);
    }
  };

  if (!isEngagementApiConfigured()) return null;
  if (!isConnected) return null;

  return (
    <Card className="rounded-2xl border-border/80 glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[hsl(var(--accent-glow))]" />
          Growth tasks
        </CardTitle>
        <CardDescription className="text-xs">
          Small sharing habits — each awards a one-time server XP bonus after you sign.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading…
          </div>
        ) : (
          TASKS.map((t) => {
            const complete = done.has(t.taskKey);
            return (
              <div
                key={t.id}
                className="rounded-xl border border-border/60 bg-black/20 px-3 py-3 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t.hint}</p>
                  </div>
                  {complete ? (
                    <span className="text-[10px] font-semibold uppercase text-[hsl(var(--accent-glow))] shrink-0">
                      Done
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.id === "room" && (
                    <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                      <Link href="/discover">Open discover</Link>
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-xl text-xs"
                    disabled={complete || busy !== null}
                    onClick={() => void signTask(t.intent)}
                  >
                    {busy === t.intent ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                        Signing…
                      </>
                    ) : complete ? (
                      "Completed"
                    ) : (
                      "Sign to complete"
                    )}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
