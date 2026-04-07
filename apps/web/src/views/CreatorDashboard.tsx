import Link from "next/link";
import { ModerationBanner } from "@/components/ModerationBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Radio,
  Coins,
  Layers,
  Droplets,
  Target,
  Gamepad2,
  Gift,
  ArrowLeft,
  Bitcoin,
  Users,
  Video,
  TrendingUp,
  MessageSquare,
  Calendar,
  Trophy,
  LineChart,
} from "lucide-react";
import { useState } from "react";

const CreatorDashboard = () => {
  const [goal, setGoalProgress] = useState(58);

  return (
    <main className="container mx-auto px-4 py-8 pb-16 max-w-5xl space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-[hsl(var(--accent-glow))] inline-flex items-center gap-1 mb-3 transition-colors"
            >
              <ArrowLeft className="w-3 h-3" /> Back
            </Link>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">Creator studio</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Go live, launch your creator coin, release collectables, and run ongoing support — all from one place.
            </p>
          </div>
          <Button asChild className="rounded-xl shrink-0">
            <Link href="/creator/go-live" className="inline-flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Start livestream
            </Link>
          </Button>
        </div>

        <ModerationBanner />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { href: "/creator/nft", label: "Release collectable", icon: Gift },
            { href: "/creator/fans", label: "Fan message", icon: MessageSquare },
            { href: "/creator/profile#schedule", label: "Schedule stream", icon: Calendar },
            { href: "/creator/competitions", label: "Start competition", icon: Trophy },
          ].map(({ href, label, icon: Icon }) => (
            <Button key={href} asChild variant="secondary" className="rounded-xl h-auto py-3 glass-panel border-border/60">
              <Link href={href} className="flex flex-col items-center justify-center gap-1">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            </Button>
          ))}
        </div>

        <Card className="rounded-2xl border-border/80 glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <LineChart className="w-4 h-4 text-[hsl(var(--neon-blue))]" />
              Analytics preview
            </CardTitle>
            <CardDescription className="text-xs">Wire subgraph + API for live KPIs.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Viewer growth", value: "+18%", sub: "7d" },
              { label: "Token price", value: "$0.042", sub: "$MAYA" },
              { label: "Support pool", value: "$48.2K", sub: "cbBTC pair" },
              { label: "Engagement", value: "92", sub: "fan score" },
            ].map((k) => (
              <div key={k.label} className="rounded-xl border border-border/50 bg-background/30 px-3 py-3">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{k.label}</p>
                <p className="text-xl font-bold tabular-nums text-foreground mt-1">{k.value}</p>
                <p className="text-[10px] text-muted-foreground">{k.sub}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Coins className="w-4 h-4 text-primary" />
                Creator coin
              </CardTitle>
              <CardDescription className="text-xs">
                New streamers auto-deploy a symbol (e.g. Maya → $MAYA). Early fans get badges, priority chat, votes,
                private rooms, and drops.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground">
                Factory deploys ERC-20 on registration — wire your backend + Base deployment here.
              </div>
              <Button variant="secondary" className="w-full rounded-xl">
                Preview token launch
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Bitcoin className="w-4 h-4 text-primary" />
                Support pool (BTC-pegged)
              </CardTitle>
              <CardDescription className="text-xs">
                Pair creator coin with cbBTC, wBTC, or tBTC so price discovery stays anchored to Bitcoin liquidity.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>Recommended: single-sided seed + Uniswap v3 / Aerodrome pool on Base.</p>
              <Button variant="outline" className="w-full rounded-xl mt-2">
                Open pool planner
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Collectable shelves (max 3)
            </CardTitle>
            <CardDescription className="text-xs">Access passes, moments, premium perks — each gated in the digital registry.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-3">
            {["Access passes", "Moments", "Premium perks"].map((title) => (
              <div key={title} className="rounded-xl border border-border/70 p-3 flex flex-col gap-2">
                <span className="text-sm font-medium text-foreground">{title}</span>
                <span className="text-[11px] text-muted-foreground flex-1">Release shelf &amp; set unlock rules.</span>
                <Button size="sm" variant="secondary" className="rounded-lg">
                  Configure
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Coin holders
              </CardTitle>
              <CardDescription className="text-xs">Snapshot from subgraph / indexer (demo balances).</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border/60 overflow-hidden text-xs">
                <div className="grid grid-cols-3 gap-2 px-3 py-2 bg-muted/30 text-muted-foreground font-medium">
                  <span>Wallet</span>
                  <span className="text-right">$TOKEN</span>
                  <span className="text-right">Tier</span>
                </div>
                {[
                  ["0x71c…9a2f", "420,000", "Gold"],
                  ["0x8f3…01bb", "98,200", "Silver"],
                  ["0x2aa…77c1", "12,050", "Bronze"],
                ].map(([w, b, t]) => (
                  <div key={w} className="grid grid-cols-3 gap-2 px-3 py-2 border-t border-border/50 font-mono text-[11px]">
                    <span className="text-foreground truncate">{w}</span>
                    <span className="text-right text-foreground tabular-nums">{b}</span>
                    <span className="text-right text-muted-foreground">{t}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Superfluid income · 7d
              </CardTitle>
              <CardDescription className="text-xs">Net streamed inflows (USDCx / ETHx) — wire Subgraph here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-1 h-28 px-1">
                {[38, 52, 44, 61, 55, 72, 68].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-primary/25 to-primary/60 min-h-[12%] transition-all"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">Last 7 days · demo data</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              Digital experiences
            </CardTitle>
            <CardDescription className="text-xs">
              Coin- or collectable-gated private rooms, office hours, and collabs — scheduled in-app, recorded where policy allows.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              Use access passes to unlock calendar slots. Gems does not support adult services or escort bookings.
            </p>
            <Button variant="secondary" className="rounded-xl shrink-0">
              Open scheduler (demo)
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                Superfluid streams
              </CardTitle>
              <CardDescription className="text-xs">Monitor incoming flow rates, net flow, and top streamers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Active streams</span>
                <span className="font-medium text-foreground">12</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Flow / hr (USDCx demo)</span>
                <span className="font-medium text-primary tabular-nums">$127.40</span>
              </div>
              <Progress value={72} className="h-2" />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Stream goals
              </CardTitle>
              <CardDescription className="text-xs">Surface milestones to viewers — ties into tips & flows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tonight&apos;s goal</span>
                <span className="text-foreground tabular-nums">{goal}%</span>
              </div>
              <Progress value={goal} className="h-2" />
              <Button size="sm" variant="outline" className="rounded-xl w-full" onClick={() => setGoalProgress((g) => (g >= 100 ? 40 : g + 10))}>
                Simulate progress
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-primary" />
              Chat games & live drops
            </CardTitle>
            <CardDescription className="text-xs">Trigger trivia, wheel spins, supporter battles, and collectable drops during the show.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch id="trivia" defaultChecked />
                <Label htmlFor="trivia" className="text-xs">
                  Trivia round
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="wheel" />
                <Label htmlFor="wheel" className="text-xs">
                  Lucky wheel
                </Label>
              </div>
            </div>
            <Button variant="default" className="rounded-xl gap-2 shrink-0">
              <Gift className="w-4 h-4" />
              Drop collectable live
            </Button>
          </CardContent>
        </Card>
    </main>
  );
};

export default CreatorDashboard;
