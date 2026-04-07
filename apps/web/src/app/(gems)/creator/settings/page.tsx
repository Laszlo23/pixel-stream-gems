"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, SlidersHorizontal, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatorSettingsPage() {
  return (
    <main className="container mx-auto px-4 py-8 pb-16 max-w-3xl space-y-6">
      <div>
        <Link href="/creator" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Payout addresses, contract admin, and account controls. Public-facing details live under Profile.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild variant="secondary" className="rounded-xl h-auto py-4 flex flex-col items-start gap-1">
          <Link href="/creator/profile" className="w-full">
            <span className="flex items-center gap-2 text-sm font-medium">
              <UserRound className="w-4 h-4 text-primary" />
              Profile &amp; schedule
            </span>
            <span className="text-[11px] text-muted-foreground font-normal text-left">
              Photo, bio, socials, live show calendar
            </span>
          </Link>
        </Button>
        <Button asChild variant="secondary" className="rounded-xl h-auto py-4 flex flex-col items-start gap-1">
          <Link href="/creator/profile#verification" className="w-full">
            <span className="flex items-center gap-2 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Verification (KYC)
            </span>
            <span className="text-[11px] text-muted-foreground font-normal text-left">
              Video call with our office team
            </span>
          </Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-border/80 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Payouts &amp; contracts
          </CardTitle>
          <CardDescription className="text-xs">
            Multisig treasury, royalty splits, and RPC keys are configured via env and your ops runbooks — not in this
            demo UI.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Wire settlement addresses to your backend when creators complete KYC and sign agreements.</p>
        </CardContent>
      </Card>
    </main>
  );
}
