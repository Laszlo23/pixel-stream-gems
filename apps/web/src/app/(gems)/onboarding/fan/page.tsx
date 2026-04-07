"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppPrivy } from "@/hooks/usePrivyCompat";
import { useAccount } from "wagmi";
import { fanOnboarding } from "@/content/gemsOnboardingCopy";
import { setFanOnboarding } from "@/lib/onboardingStorage";
import { addGlobalRewardXp } from "@/lib/globalRewardXp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";

const FAN_COMPLETE_XP = 200;

export default function FanOnboardingPage() {
  const router = useRouter();
  const { login, authenticated, ready } = useAppPrivy();
  const { isConnected, address } = useAccount();
  const [step, setStep] = useState(0);
  const [displayName, setDisplayName] = useState("");

  const total = fanOnboarding.steps.length;
  const current = fanOnboarding.steps[step];
  const pct = ((step + 1) / total) * 100;

  const needsWallet = !ready || !authenticated || !isConnected || !address;

  const finish = () => {
    setFanOnboarding({
      complete: true,
      displayName: displayName.trim() || undefined,
    });
    addGlobalRewardXp(FAN_COMPLETE_XP);
    toast.success((fanOnboarding.steps[total - 1] as { rewardLabel?: string }).rewardLabel ?? "Welcome", {
      description: `+${FAN_COMPLETE_XP} bonus sparkle (local)`,
    });
    router.replace("/");
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
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{fanOnboarding.title}</h1>
            <p className="text-[10px] text-muted-foreground">
              Step {step + 1} / {total}
            </p>
          </div>
        </div>

        <Progress value={pct} className="h-1.5" />

        {needsWallet ? (
          <div className="surface-card rounded-2xl p-6 space-y-4 border border-border/60">
            <p className="text-sm text-muted-foreground">
              Sign in so we can save your progress and wire your wallet for tips and drops.
            </p>
            <Button className="rounded-xl w-full" onClick={() => login()}>
              Sign in
            </Button>
            <Button variant="ghost" className="rounded-xl w-full text-xs" asChild>
              <Link href="/">Browse without finishing</Link>
            </Button>
          </div>
        ) : (
          <div className="surface-card rounded-2xl p-6 space-y-4 border border-border/60">
            <h2 className="text-base font-semibold text-foreground">{current.headline}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{current.body}</p>

            {step === 3 && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {fanOnboarding.displayNamePlaceholder}
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rounded-xl bg-secondary border-border"
                  maxLength={32}
                  placeholder="e.g. neon_velvet"
                />
              </div>
            )}

            <p className="text-[10px] text-muted-foreground">{fanOnboarding.skipHint}</p>

            <div className="flex gap-2 pt-2">
              {step > 0 && (
                <Button type="button" variant="outline" className="rounded-xl flex-1" onClick={() => setStep((s) => s - 1)}>
                  Back
                </Button>
              )}
              <Button type="button" className="rounded-xl flex-1" onClick={next}>
                {step >= total - 1 ? fanOnboarding.ctaFinish : fanOnboarding.ctaNext}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
