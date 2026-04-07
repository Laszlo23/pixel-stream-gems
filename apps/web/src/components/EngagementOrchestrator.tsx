"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppPrivy } from "@/hooks/usePrivyCompat";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import {
  getPendingReferral,
  clearPendingReferral,
  hasClaimedReferralBonus,
  markReferralBonusClaimed,
  storePendingReferral,
} from "@/lib/referralStorage";
import { addGlobalRewardXp } from "@/lib/globalRewardXp";
import { isEngagementApiConfigured } from "@/lib/engagementApi";
import { isFanOnboardingComplete, isCreatorOnboardingComplete } from "@/lib/onboardingStorage";
import { referralCopy } from "@/content/gemsOnboardingCopy";

const REFERRAL_BONUS_XP = 120;

function shouldSkipOnboardingGate(path: string) {
  return (
    path.startsWith("/onboarding") ||
    path.startsWith("/sign-in") ||
    path.startsWith("/legal") ||
    path.startsWith("/settings") ||
    path.startsWith("/messages") ||
    /** Let fans watch / browse before finishing onboarding — blocking /live felt like a broken app. */
    path.startsWith("/live") ||
    path.startsWith("/discover") ||
    path.startsWith("/u/") ||
    path.startsWith("/marketplace") ||
    path.startsWith("/competitions") ||
    path.startsWith("/leaderboards") ||
    path.startsWith("/clips")
  );
}

/** Captures ?ref=, applies one-time referral XP after login, redirects into onboarding when needed. */
export function EngagementOrchestrator() {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated } = useAppPrivy();
  const { isConnected, address } = useAccount();
  const capturedUrlRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || capturedUrlRef.current) return;
    capturedUrlRef.current = true;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) storePendingReferral(ref);
  }, []);

  useEffect(() => {
    if (!ready || !authenticated || !isConnected || !address) return;
    if (shouldSkipOnboardingGate(pathname)) return;

    if (!isFanOnboardingComplete()) {
      if (pathname !== "/onboarding/fan") router.replace("/onboarding/fan");
      return;
    }

    if (
      pathname.startsWith("/creator") &&
      !pathname.startsWith("/onboarding/creator") &&
      !isCreatorOnboardingComplete()
    ) {
      router.replace("/onboarding/creator");
    }
  }, [ready, authenticated, isConnected, address, pathname, router]);

  useEffect(() => {
    if (!ready || !authenticated || !isConnected || !address) return;
    if (isEngagementApiConfigured()) return;
    if (hasClaimedReferralBonus()) return;
    const pending = getPendingReferral();
    if (!pending) return;

    addGlobalRewardXp(REFERRAL_BONUS_XP);
    markReferralBonusClaimed();
    clearPendingReferral();
    toast.success(referralCopy.toastTitle, {
      description: referralCopy.toastDescription(pending.code),
    });
  }, [ready, authenticated, isConnected, address]);

  return null;
}
