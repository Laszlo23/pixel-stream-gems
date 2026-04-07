import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  COMPETITION_REWARDS,
  TOP_LP_LEADERBOARD,
  SUPERFLUID_LEAGUE,
  TOP_TIPPED_CREATORS_MONTH,
  TOP_TIPPED_CREATORS_WEEK,
  TOP_TIPPING_FANS,
} from "@/data/competitions";
import type {
  LpRow,
  SuperfluidLeagueRow,
  TippedCreatorRow,
  TippingFanRow,
} from "@/data/competitions";
import { ArrowLeft, Coins, Crown, Droplets, Trophy, Waves } from "lucide-react";

const Competitions = () => {
  const [creatorPeriod, setCreatorPeriod] = useState<"week" | "month">("week");
  const [topFans, setTopFans] = useState(TOP_TIPPING_FANS);
  const [creatorsWeek, setCreatorsWeek] = useState(TOP_TIPPED_CREATORS_WEEK);
  const [creatorsMonth, setCreatorsMonth] = useState(TOP_TIPPED_CREATORS_MONTH);
  const [lpBoard, setLpBoard] = useState(TOP_LP_LEADERBOARD);
  const [sfLeague, setSfLeague] = useState(SUPERFLUID_LEAGUE);
  const [rewards, setRewards] = useState(COMPETITION_REWARDS);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return;
    fetch(`${base.replace(/\/$/, "")}/v1/competitions`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: Record<string, unknown> | null) => {
        if (!j) return;
        if (Array.isArray(j.TOP_TIPPING_FANS)) setTopFans(j.TOP_TIPPING_FANS as TippingFanRow[]);
        if (Array.isArray(j.TOP_TIPPED_CREATORS_WEEK))
          setCreatorsWeek(j.TOP_TIPPED_CREATORS_WEEK as TippedCreatorRow[]);
        if (Array.isArray(j.TOP_TIPPED_CREATORS_MONTH))
          setCreatorsMonth(j.TOP_TIPPED_CREATORS_MONTH as TippedCreatorRow[]);
        if (Array.isArray(j.TOP_LP_LEADERBOARD)) setLpBoard(j.TOP_LP_LEADERBOARD as LpRow[]);
        if (Array.isArray(j.SUPERFLUID_LEAGUE)) setSfLeague(j.SUPERFLUID_LEAGUE as SuperfluidLeagueRow[]);
        if (j.COMPETITION_REWARDS && typeof j.COMPETITION_REWARDS === "object")
          setRewards(j.COMPETITION_REWARDS as typeof COMPETITION_REWARDS);
      })
      .catch(() => {});
  }, []);

  const creators = creatorPeriod === "week" ? creatorsWeek : creatorsMonth;

  return (
    <div className="min-h-full bg-background lux-hero-bg">
      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-24 lg:pb-20 max-w-5xl space-y-8">
        <Button variant="ghost" size="sm" className="-ml-2 rounded-xl gap-1 text-muted-foreground" asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </Button>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Competitions</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
            Global leaderboards reset on a schedule you configure. Winners earn badges, XP, NFTs, and homepage placement
            — wire subgraph + indexer for real scores.
          </p>
        </div>

        <Tabs defaultValue="fans" className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-1 rounded-xl bg-secondary/80 p-1 justify-start">
            <TabsTrigger value="fans" className="rounded-lg text-xs gap-1">
              <Coins className="w-3.5 h-3.5" /> Top tipping fans
            </TabsTrigger>
            <TabsTrigger value="creators" className="rounded-lg text-xs gap-1">
              <Trophy className="w-3.5 h-3.5" /> Top creators
            </TabsTrigger>
            <TabsTrigger value="lp" className="rounded-lg text-xs gap-1">
              <Droplets className="w-3.5 h-3.5" /> Liquidity
            </TabsTrigger>
            <TabsTrigger value="flow" className="rounded-lg text-xs gap-1">
              <Waves className="w-3.5 h-3.5" /> Superfluid league
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fans" className="mt-6 space-y-4">
            <RewardsCard title="Weekly rewards" items={[...rewards.tippingFans]} />
            <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Leaderboard</CardTitle>
                <CardDescription className="text-xs">Tips aggregated this week (demo).</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Fan</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead className="text-right">Tips</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topFans.map((r) => (
                      <TableRow key={r.username}>
                        <TableCell className="text-muted-foreground">{r.rank}</TableCell>
                        <TableCell className="font-medium">{r.username}</TableCell>
                        <TableCell>
                          <Link href={`/u/${r.creatorId}`} className="text-primary hover:underline">
                            {r.creatorName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-primary">${r.tipsUsd.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creators" className="mt-6 space-y-4">
            <RewardsCard title="Top creator perks" items={[...rewards.tippedCreators]} />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={creatorPeriod === "week" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => setCreatorPeriod("week")}
              >
                Weekly
              </Button>
              <Button
                size="sm"
                variant={creatorPeriod === "month" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => setCreatorPeriod("month")}
              >
                Monthly
              </Button>
            </div>
            <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Leaderboard</CardTitle>
                <CardDescription className="text-xs">Tips + active Superfluid supporters (demo).</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead className="text-right">Tips</TableHead>
                      <TableHead className="text-right">Flow fans</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-muted-foreground">{r.rank}</TableCell>
                        <TableCell>
                          <Link href={`/u/${r.id}`} className="font-medium text-foreground hover:text-primary">
                            {r.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">${r.tipsUsd.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums text-muted-foreground">{r.flowSupporters}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lp" className="mt-6 space-y-4">
            <RewardsCard title="LP competition rewards" items={[...rewards.lp]} />
            <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Liquidity leaderboard</CardTitle>
                <CardDescription className="text-xs">Creator token pools vs BTC-pegged pairs.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Pool</TableHead>
                      <TableHead className="text-right">Liquidity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lpBoard.map((r) => (
                      <TableRow key={r.wallet}>
                        <TableCell className="text-muted-foreground">{r.rank}</TableCell>
                        <TableCell className="font-mono text-xs">{r.wallet}</TableCell>
                        <TableCell>
                          <Link href={`/u/${r.creatorId}`} className="text-primary hover:underline text-sm">
                            {r.pool}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-primary">{r.liquidityUsd}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flow" className="mt-6 space-y-4">
            <RewardsCard title="Supporter league rewards" items={[...rewards.superfluid]} icon={<Crown className="w-4 h-4" />} />
            <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">Superfluid supporter league</CardTitle>
                <CardDescription className="text-xs">Longest running flows × streamed notional (demo).</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Supporter</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead className="text-right">Streak (hrs)</TableHead>
                      <TableHead className="text-right">Streamed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sfLeague.map((r) => (
                      <TableRow key={r.username}>
                        <TableCell className="text-muted-foreground">{r.rank}</TableCell>
                        <TableCell className="font-medium">{r.username}</TableCell>
                        <TableCell>
                          <Link href={`/u/${r.creatorId}`} className="text-primary hover:underline">
                            {r.creatorName}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{r.longestStreakHrs}</TableCell>
                        <TableCell className="text-right tabular-nums text-primary">${r.streamedUsd.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

function RewardsCard({
  title,
  items,
  icon,
}: {
  title: string;
  items: readonly string[];
  icon?: ReactNode;
}) {
  return (
    <Card className="rounded-2xl border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {items.map((x) => (
          <Badge key={x} variant="secondary" className="rounded-lg font-normal">
            {x}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}

export default Competitions;
