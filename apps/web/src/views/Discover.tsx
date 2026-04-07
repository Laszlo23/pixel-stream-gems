"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DiscoverRail } from "@/components/discover/DiscoverRail";
import { DiscoverStreamCard } from "@/components/discover/DiscoverStreamCard";
import { STREAMERS, orderStreamersAvoidAdjacentSamePoster } from "@/data/streamers";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Moon } from "lucide-react";

const byViewers = [...STREAMERS].sort((a, b) => b.viewers - a.viewers);
const byPool = [...STREAMERS].sort((a, b) => parseFloat(b.poolTvlUsd.replace(/[^0-9.]/g, "")) - parseFloat(a.poolTvlUsd.replace(/[^0-9.]/g, "")));
const newCreators = orderStreamersAvoidAdjacentSamePoster([...STREAMERS].slice(0, 4), "16x9");
const liveRightNow = orderStreamersAvoidAdjacentSamePoster(byViewers.slice(0, 8), "16x9");
const deepSupport = orderStreamersAvoidAdjacentSamePoster(byPool.slice(0, 6), "16x9");

const collectableDrops = [
  { title: "Access Pass wave", creator: "Maya", price: "0.02 ETH", ends: "2h" },
  { title: "Moment Card #12", creator: "PixelPanda", price: "0.04 ETH", ends: "6h" },
  { title: "VIP recognition", creator: "BeatsMaster", price: "0.08 ETH", ends: "1d" },
];

const supporters = [
  { user: "CryptoKing", to: "Maya", amount: "$2.4k", badge: "Whale" },
  { user: "NeonFox", to: "PixelPanda", amount: "$1.1k", badge: "Gold" },
  { user: "StarDust", to: "BeatsMaster", amount: "$820", badge: "Silver" },
];

const Discover = () => {
  return (
    <div className="min-h-full bg-background lux-hero-bg">
      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-8 lg:pb-12 max-w-[1600px] space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="badge-subtle w-fit mb-3">
              <Moon className="w-3 h-3" />
              Private rooms · VIP energy
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Discover <span className="text-gradient">who&apos;s on</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
              Clean cards, real faces, rooms that feel close. No dashboard noise — just people and tonight&apos;s lineup.
            </p>
          </div>
          <Button asChild className="rounded-xl shrink-0 shadow-[0_0_24px_hsl(var(--primary)/0.3)] transition-all duration-300 hover:shadow-[0_0_32px_hsl(var(--primary)/0.4)]">
            <Link href="/live/maya">Join the show</Link>
          </Button>
        </div>

        <DiscoverRail title="Live right now" subtitle="Rooms filling up" actionHref="/leaderboards" actionLabel="Rankings">
          {liveRightNow.map((s) => (
            <div key={s.id} className="snap-start">
              <DiscoverStreamCard streamer={s} supportLabel="Love meter climbing" />
            </div>
          ))}
        </DiscoverRail>

        <DiscoverRail title="New on Gems" subtitle="Fresh energy this week" actionHref="/discover">
          {newCreators.map((s) => (
            <div key={s.id} className="snap-start">
              <DiscoverStreamCard streamer={s} supportLabel="Building their circle" />
            </div>
          ))}
        </DiscoverRail>

        <DiscoverRail title="Deep support" subtitle="Largest support pools" actionHref="/defi">
          {deepSupport.map((s) => (
            <div key={s.id} className="snap-start">
              <DiscoverStreamCard streamer={s} supportLabel={`Pool ${s.poolTvlUsd}`} />
            </div>
          ))}
        </DiscoverRail>

        <DiscoverRail title="New collectables" subtitle="Access passes & moments" actionHref="/marketplace">
          {collectableDrops.map((d) => (
            <Card
              key={d.title}
              className="flex-shrink-0 w-[240px] snap-start rounded-2xl border-border/60 bg-[#141414]/50 backdrop-blur-md hover:border-[hsl(var(--primary)/0.35)] transition-all duration-300"
            >
              <CardContent className="p-4 space-y-3">
                <span className="badge-gold w-fit">{d.ends} left</span>
                <p className="font-semibold text-foreground leading-snug">{d.title}</p>
                <p className="text-xs text-muted-foreground">{d.creator}</p>
                <p className="text-sm font-mono text-[hsl(var(--accent-glow))]">{d.price}</p>
                <Button asChild size="sm" variant="secondary" className="w-full rounded-xl">
                  <Link href="/marketplace">View</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </DiscoverRail>

        <DiscoverRail title="Top supporters" subtitle="This week&apos;s love leaderboard" actionHref="/leaderboards">
          {supporters.map((u) => (
            <Card
              key={u.user}
              className="flex-shrink-0 w-[220px] snap-start rounded-2xl border-border/60 bg-[#141414]/45 backdrop-blur-md"
            >
              <CardContent className="p-4 space-y-2">
                <p className="font-semibold text-foreground">{u.user}</p>
                <p className="text-xs text-muted-foreground">Sending love to {u.to}</p>
                <p className="text-lg font-bold tabular-nums text-gradient">{u.amount}</p>
                <span className="badge-gold text-[9px]">{u.badge}</span>
              </CardContent>
            </Card>
          ))}
        </DiscoverRail>

        <DiscoverRail title="Live competitions" subtitle="Climb for prizes & recognition" actionHref="/competitions">
          {["Love blitz", "Support marathon", "Pool spotlight", "Moment royale"].map((name) => (
            <Card
              key={name}
              className="flex-shrink-0 w-[260px] snap-start rounded-2xl border border-[hsl(var(--primary)/0.25)] bg-gradient-to-br from-[hsl(var(--primary)/0.08)] to-transparent backdrop-blur-md"
            >
              <CardContent className="p-4 flex flex-col gap-3 h-full">
                <Sparkles className="w-5 h-5 text-[hsl(var(--accent-glow))]" />
                <p className="font-bold text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground flex-1">Ends in 2d 14h · 2.4k joined</p>
                <Button asChild size="sm" className="rounded-xl w-full">
                  <Link href="/competitions">Enter</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </DiscoverRail>
      </main>
    </div>
  );
};

export default Discover;
