"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppPrivy } from "@/hooks/usePrivyCompat";
import { useAccount } from "wagmi";
import { creatorOnboarding } from "@/content/gemsOnboardingCopy";
import { setCreatorOnboarding } from "@/lib/onboardingStorage";
import { addGlobalRewardXp } from "@/lib/globalRewardXp";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Mic2 } from "lucide-react";

const CREATOR_COMPLETE_XP = 250;

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const { login, authenticated, ready } = useAppPrivy();
  const { isConnected, address } = useAccount();
  const [step, setStep] = useState(0);

  const total = creatorOnboarding.steps.length;
  const current = creatorOnboarding.steps[step];
  const pct = ((step + 1) / total) * 100;

  const needsWallet = !ready || !authenticated || !isConnected || !address;

  const finish = () => {
    setCreatorOnboarding({ complete: true });
    addGlobalRewardXp(CREATOR_COMPLETE_XP);
    toast.success((creatorOnboarding.steps[total - 1] as { rewardLabel?: string }).rewardLabel ?? "Studio ready", {
      description: `+${CREATOR_COMPLETE_XP} bonus flair (local)`,
    });
    router.replace("/creator");
  };

  const next = () => {
    if (step >= total - 1) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  };

  return (
    <div className="min-h-full bg-background">
      <main className="container mx-auto px-4 py-8 max-w-lg space-y-6">
        <Link
          href="/creator"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" /> Studio
        </Link>

        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{creatorOnboarding.title}</h1>
            <p className="text-[10px] text-muted-foreground">
              Step {step + 1} / {total}
            </p>
          </div>
        </div>

        <Progress value={pct} className="h-1.5" />

        {needsWallet ? (
          <div className="surface-card rounded-2xl p-6 space-y-4 border border-border/60">
            <p className="text-sm text-muted-foreground">
              Creators need a signed-in wallet for payouts and identity. Log in to continue.
            </p>
            <Button className="rounded-xl w-full" onClick={() => login()}>
              Sign in
            </Button>
            <Button variant="ghost" className="rounded-xl w-full text-xs" asChild>
              <Link href="/creator">Back to studio</Link>
            </Button>
          </div>
        ) : (
          <div className="surface-card rounded-2xl p-6 space-y-4 border border-border/60">
            <h2 className="text-base font-semibold text-foreground">{current.headline}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.body}</p>

            <div className="flex gap-2 pt-2">
              {step > 0 && (
                <Button type="button" variant="outline" className="rounded-xl flex-1" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              <Button type="button" className="rounded-xl flex-1" onClick={next}>
                {step >= total - 1 ? creatorOnboarding.ctaFinish : creatorOnboarding.ctaNext}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
