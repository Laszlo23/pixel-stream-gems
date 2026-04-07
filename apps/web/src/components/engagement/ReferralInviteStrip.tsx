"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Gift, Loader2, X } from "lucide-react";
import {
  fetchEngagementChallenge,
  isEngagementApiConfigured,
  postReferralAttest,
} from "@/lib/engagementApi";
import {
  clearPendingReferral,
  getPendingReferral,
  markReferralBonusClaimed,
  type PendingReferral,
} from "@/lib/referralStorage";
import { referralCopy } from "@/content/gemsOnboardingCopy";

export function ReferralInviteStrip() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<PendingReferral | null>(null);

  useEffect(() => {
    setPending(getPendingReferral());
  }, [address]);
  const show =
    isEngagementApiConfigured() &&
    isConnected &&
    address &&
    pending &&
    !dismissed &&
    pending.code.toLowerCase() !== address.toLowerCase();

  const onSync = useCallback(async () => {
    if (!address || !pending) return;
    setBusy(true);
    try {
      const referrer = pending.code.trim();
      const ch = await fetchEngagementChallenge(address, chainId, "referral_bind", referrer);
      if (!ch?.message) {
        toast.error("Could not start referral sync");
        return;
      }
      const signature = await signMessageAsync({ message: ch.message });
      const out = await postReferralAttest(ch.message, signature);
      if (!out) {
        toast.error("Referral sync failed");
        return;
      }
      toast.success(referralCopy.toastTitle, {
        description: out.created ? referralCopy.referralSyncedNew : referralCopy.referralSyncedExisting,
      });
      markReferralBonusClaimed();
      clearPendingReferral();
      setDismissed(true);
    } catch (e) {
      console.warn(e);
      toast.error("Signature cancelled or failed");
    } finally {
      setBusy(false);
    }
  }, [address, chainId, pending, signMessageAsync]);

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Pending invite"
      className="border-b border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--primary)/0.08)] px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
    >
      <div className="flex items-start gap-2 text-xs text-foreground/90 min-w-0">
        <Gift className="w-4 h-4 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
        <p className="leading-snug">
          You arrived via an invite.{" "}
          <span className="text-muted-foreground">Sign once to credit your referrer on the server.</span>
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          size="sm"
          className="rounded-xl h-8 text-xs"
          disabled={busy}
          onClick={() => void onSync()}
        >
          {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Sign & sync"}
        </Button>
        <Button variant="outline" size="sm" className="h-8 text-xs rounded-xl px-3" asChild>
          <Link href="/profile">Profile</Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-xl text-muted-foreground"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
