"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, Droplets, Radio } from "lucide-react";

const rows = [
  { rank: 1, name: "streamQueen", metric: "$48.2k tips · 7d", badge: "Crown" },
  { rank: 2, name: "pixelPanda", metric: "$31.0k tips · 7d", badge: "Gold" },
  { rank: 3, name: "neonNova", metric: "$22.4k tips · 7d", badge: "Silver" },
];

const Leaderboards = () => {
  return (
    <div className="min-h-full bg-background">
      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-24 lg:pb-16 max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            Leaderboards
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Top tippers, top creators, LP league, and Superfluid supporter league — wire to indexer + API (demo rows below).
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Top fans (demo)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {rows.map((r) => (
                <div key={r.rank} className="flex justify-between items-center rounded-lg border border-border/60 px-3 py-2">
                  <span className="text-muted-foreground">#{r.rank}</span>
                  <span className="font-medium text-foreground">{r.name}</span>
                  <span className="text-xs text-muted-foreground text-right">{r.metric}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Droplets className="w-4 h-4" /> LP + streams
              </CardTitle>
              <CardDescription className="text-xs">Rank by pool depth and streamed value.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                Superfluid supporter league uses subgraph flow totals.
              </p>
              <Button asChild variant="secondary" className="rounded-xl w-full mt-2">
                <Link href="/competitions">Open competitions hub</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboards;
