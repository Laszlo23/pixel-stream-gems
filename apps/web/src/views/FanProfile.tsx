"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ReferralShareCard } from "@/components/ReferralShareCard";
import { DailyRewardCard } from "@/components/engagement/DailyRewardCard";
import { GrowthTasksCard } from "@/components/engagement/GrowthTasksCard";
import { getGlobalRewardXp } from "@/lib/globalRewardXp";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Wallet, Coins, Image as ImageIcon, Trophy, History, Sparkles, Scissors, TrendingUp, Zap, BarChart3, Droplets, PiggyBank } from "lucide-react";

const demoTokens = [
  { symbol: "MAYA", amount: "1,240", perks: "Badge · priority" },
  { symbol: "PANDA", amount: "80", perks: "Votes" },
];

const demoNfts = [
  { name: "Backstage Pass #04", type: "Access" },
  { name: "Stream Still #112", type: "Moment" },
  { name: "1:1 Session Voucher", type: "Perk" },
];

const badges = ["Early supporter", "Trivia ace", "Flow champion", "Collectable hunter", "Pool pioneer"];

const engagementRows = [
  { label: "Watch time this week", value: 78, unit: "min" },
  { label: "Chat messages", value: 56, unit: "" },
  { label: "Tips sent", value: 42, unit: "evt" },
  { label: "Games & polls", value: 23, unit: "" },
];

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

const FanProfile = () => {
  const { address, isConnected } = useAccount();
  const [bonusXp, setBonusXp] = useState(0);
  useEffect(() => setBonusXp(getGlobalRewardXp()), []);
  const display = isConnected && address ? shortenAddress(address) : "Not connected";

  return (
    <div className="min-h-full bg-background">
      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-24 lg:pb-16 max-w-3xl space-y-8">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary)/0.35)] to-[#141414] border border-[hsl(var(--primary)/0.3)] flex items-center justify-center text-2xl shadow-[0_0_28px_hsl(var(--primary)/0.2)]">
              ✦
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Your profile</h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5" />
                <span className="font-mono text-xs">{display}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Manage sign-in &amp; wallet under{" "}
                <Link href="/settings#account" className="text-[hsl(var(--accent-glow))] hover:underline">
                  Settings → Linked account
                </Link>
                .
              </p>
              <p className="text-xs text-muted-foreground mt-2 max-w-md">
                Want to stream? Use <span className="text-foreground font-medium">Create creator profile</span> or{" "}
                <span className="text-foreground font-medium">Creator studio</span> in the site footer.
              </p>
              {isConnected && bonusXp > 0 && (
                <p className="text-[10px] text-primary mt-2 font-medium">
                  Bonus sparkle (onboarding / referrals, local): +{bonusXp} XP
                </p>
              )}
            </div>
          </div>
        </div>

        <ReferralShareCard />

        <div className="grid gap-4 lg:grid-cols-2">
          <DailyRewardCard />
          <GrowthTasksCard />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border-border/80 glass-panel sm:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-[hsl(var(--gold))]" />
                Fan power score
              </CardTitle>
              <CardDescription className="text-xs">Weighted tips, holds, LP, Superfluid streaks, and chat XP.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold tabular-nums text-gradient">8,420</p>
              <p className="text-xs text-muted-foreground mt-1">Top 4% of supporters this week</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="text-muted-foreground text-xs">Global fans</p>
              <p className="text-2xl font-bold text-foreground">#128</p>
              <p className="text-[10px] text-muted-foreground">Supporter league · rising</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[hsl(var(--neon-blue))]" />
              Liquidity positions
            </CardTitle>
            <CardDescription className="text-xs">Creator pools you back (demo).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between rounded-xl border border-border/60 px-3 py-2">
              <span className="text-foreground">MAYA / cbBTC</span>
              <span className="font-mono text-[hsl(var(--neon-blue))]">$1,240 LP</span>
            </div>
            <div className="flex justify-between rounded-xl border border-border/60 px-3 py-2">
              <span className="text-foreground">PANDA / wBTC</span>
              <span className="font-mono text-[hsl(var(--neon-blue))]">$320 LP</span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 bg-gradient-to-br from-card to-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Fan reputation
            </CardTitle>
            <CardDescription className="text-xs">
              Level up from tips, creator coins, support pools, ongoing love, and community play.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-lg text-sm px-3 py-1">Level 12 · Sapphire</Badge>
              <span className="text-xs text-muted-foreground">Next: Emerald · 2,400 rep to go</span>
            </div>
            <Progress value={62} className="h-2" />
            <p className="text-[10px] text-muted-foreground">
              Unlocks: chat effects, profile frames, private rooms, curated collectable drops.
            </p>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <Badge key={b} variant="secondary" className="rounded-lg font-normal text-[10px]">
                  {b}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Engagement mining · this week
            </CardTitle>
            <CardDescription className="text-xs">Points convert to creator coins &amp; platform rewards (indexer demo).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {engagementRows.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="tabular-nums text-foreground">
                    {r.value}
                    {r.unit ? ` ${r.unit}` : ""}
                  </span>
                </div>
                <Progress value={Math.min(100, r.value * 1.2)} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Discovery rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                You backed <span className="text-foreground font-medium">StudyLoop</span> under 100 followers — early supporter
                moment card unlocked.
              </p>
              <Badge variant="outline" className="rounded-md text-[10px]">
                +500 $LOOP bonus (demo)
              </Badge>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Scissors className="w-4 h-4 text-primary" />
                Clips you published
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>2 clips live · 1 trending on homepage this week.</p>
              <Button variant="secondary" size="sm" className="rounded-lg text-xs h-8 w-full">
                Open clip editor (demo)
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              Creator coins
            </CardTitle>
            <CardDescription className="text-xs">Micro-economies you participate in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoTokens.map((t) => (
              <div
                key={t.symbol}
                className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm"
              >
                <span className="font-medium text-foreground">${t.symbol}</span>
                <span className="text-muted-foreground tabular-nums">{t.amount}</span>
                <span className="text-[10px] text-primary">{t.perks}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Collectables
            </CardTitle>
            <CardDescription className="text-xs">Passes, moments, and perks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoNfts.map((n) => (
              <div
                key={n.name}
                className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2 text-sm"
              >
                <span className="text-foreground">{n.name}</span>
                <Badge variant="outline" className="rounded-lg text-[10px]">
                  {n.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80 glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-[hsl(var(--gold))]" />
              Earnings
            </CardTitle>
            <CardDescription className="text-xs">Tips, support rewards, engagement payouts (indexer).</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl border border-border/50 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">This week</p>
              <p className="text-lg font-bold tabular-nums text-[hsl(var(--gold))]">$42.80</p>
            </div>
            <div className="rounded-xl border border-border/50 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Claimable</p>
              <p className="text-lg font-bold tabular-nums text-[hsl(var(--neon-blue))]">120 $GEMS</p>
            </div>
            <div className="rounded-xl border border-border/50 p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Collectable income</p>
              <p className="text-lg font-bold tabular-nums text-foreground">$8.10</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Streams watched
            </CardTitle>
            <CardDescription className="text-xs">Recent rooms and watch time (demo data).</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Maya — Music · Live · 2h 10m</p>
            <p>PixelPanda — Retro night · 45m</p>
            <Button asChild variant="link" className="px-0 h-auto text-primary">
              <Link href="/">Discover more</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/competitions">View competitions</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default FanProfile;
