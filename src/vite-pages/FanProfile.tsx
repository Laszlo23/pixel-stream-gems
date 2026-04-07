import { Link } from "react-router-dom";
import { useAccount } from "wagmi";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Wallet, Coins, Image as ImageIcon, Trophy, History, Sparkles, Scissors, TrendingUp } from "lucide-react";

const demoTokens = [
  { symbol: "MAYA", amount: "1,240", perks: "Badge · priority" },
  { symbol: "PANDA", amount: "80", perks: "Votes" },
];

const demoNfts = [
  { name: "Backstage Pass #04", type: "Access" },
  { name: "Stream Still #112", type: "Moment" },
  { name: "1:1 Session Voucher", type: "Perk" },
];

const badges = ["Early supporter", "Trivia ace", "Flow champion", "NFT collector", "LP pioneer"];

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
  const display = isConnected && address ? shortenAddress(address) : "Not connected";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-20 pb-16 max-w-3xl space-y-8">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/30 to-transparent border border-border flex items-center justify-center text-2xl ring-2 ring-primary/20">
            ✦
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Fan profile</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Wallet className="w-3.5 h-3.5" />
              <span className="font-mono text-xs">{display}</span>
            </p>
          </div>
        </div>

        <Card className="rounded-2xl border-border/80 bg-gradient-to-br from-card to-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Fan reputation
            </CardTitle>
            <CardDescription className="text-xs">
              Level up from tips, token holds, LP, Superfluid streaks, and community play.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-lg text-sm px-3 py-1">Level 12 · Sapphire</Badge>
              <span className="text-xs text-muted-foreground">Next: Emerald · 2,400 rep to go</span>
            </div>
            <Progress value={62} className="h-2" />
            <p className="text-[10px] text-muted-foreground">
              Unlocks: chat effects, profile frames, private streams, curated NFT drops.
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
            <CardDescription className="text-xs">Points convert to creator tokens &amp; platform rewards (indexer demo).</CardDescription>
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
                NFT minted.
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
              Creator tokens
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
              NFTs
            </CardTitle>
            <CardDescription className="text-xs">Access, moments, and perks.</CardDescription>
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

        <Card className="rounded-2xl border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Stream history
            </CardTitle>
            <CardDescription className="text-xs">Recent rooms and watch time (demo data).</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Maya — Music · Live · 2h 10m</p>
            <p>PixelPanda — Retro night · 45m</p>
            <Button asChild variant="link" className="px-0 h-auto text-primary">
              <Link to="/">Discover more</Link>
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/competitions">View competitions</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default FanProfile;
