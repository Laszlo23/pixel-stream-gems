"use client";

import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { referralCopy } from "@/content/gemsOnboardingCopy";
import { Gift } from "lucide-react";

export function ReferralShareCard() {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);

  const refCode = address ? address.toLowerCase() : "";
  const shareUrl =
    typeof window !== "undefined" && refCode
      ? `${window.location.origin}/?ref=${encodeURIComponent(refCode)}`
      : "";

  const onCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [shareUrl]);

  if (!isConnected || !address) return null;

  return (
    <Card className="rounded-2xl border-border/80 glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Gift className="w-4 h-4 text-primary" />
          {referralCopy.shareLabel}
        </CardTitle>
        <CardDescription className="text-xs">{referralCopy.shareHint}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[10px] font-mono break-all text-muted-foreground bg-muted/40 rounded-xl px-3 py-2 border border-border/50">
          {shareUrl}
        </p>
        <Button type="button" size="sm" variant="secondary" className="rounded-xl" onClick={() => void onCopy()}>
          {copied ? referralCopy.copied : referralCopy.copyButton}
        </Button>
      </CardContent>
    </Card>
  );
}
