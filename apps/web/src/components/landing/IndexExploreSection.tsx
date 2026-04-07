"use client";

import { useMemo, useState } from "react";
import StreamerCard from "@/components/StreamerCard";
import { TrendingStreamsSection } from "@/components/TrendingStreamsSection";
import { HomeLeaderboardStrip } from "@/components/HomeLeaderboardStrip";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Crown, ShoppingBag, ChevronDown } from "lucide-react";
import { CreatorCardThumbnail } from "@/components/creator/CreatorPublicMedia";
import { STREAMERS, orderStreamersAvoidAdjacentSamePoster, resolveStreamerPosterSrc } from "@/data/streamers";
import { MARKET_CATEGORIES, type MarketCategoryId } from "@/data/categories";
import { cn } from "@/lib/utils";

const vipCreators = orderStreamersAvoidAdjacentSamePoster(
  [...STREAMERS].sort((a, b) => b.level - a.level).slice(0, 3),
  "16x9",
);

const collectableTeasers = [
  { title: "Access Pass", sub: "Private rooms", creator: "Maya" },
  { title: "Moment Card", sub: "Last night’s set", creator: "PixelPanda" },
  { title: "Signature Card", sub: "Signed drop", creator: "BeatsMaster" },
];

/** Deeper browse — below the marketing funnel on home. */
export function IndexExploreSection() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<MarketCategoryId | "all">("all");
  const [showMoreCreators, setShowMoreCreators] = useState(false);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STREAMERS.filter((s) => {
      const catOk = activeCat === "all" || s.marketCategory === activeCat;
      const qOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.tokenSymbol.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return catOk && qOk;
    });
  }, [query, activeCat]);

  const exploreGrid = useMemo(() => {
    const base = showMoreCreators ? filtered : filtered.slice(0, 6);
    return orderStreamersAvoidAdjacentSamePoster(base, "16x9");
  }, [filtered, showMoreCreators]);

  return (
    <div className="relative z-10 border-t border-[rgba(255,43,85,0.12)] bg-[#070707]">
      <div className="container mx-auto max-w-6xl px-4 py-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-[hsl(var(--accent-glow))] transition-colors"
        >
          {open ? "Hide platform browse" : "Browse full platform"}
          <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="container mx-auto max-w-6xl px-4 space-y-14 pb-16">
          <section>
            <div className="flex items-center justify-between gap-4 mb-2">
              <h2 className="font-display text-xl font-bold text-foreground tracking-tight">Trending shows</h2>
              <Button variant="ghost" size="sm" className="text-[hsl(var(--accent-glow))]" asChild>
                <Link href="/discover">See all</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">The rooms everyone&apos;s talking about.</p>
            <TrendingStreamsSection hideHeader />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-[hsl(var(--gold))]" />
              <h2 className="font-display text-xl font-bold text-foreground tracking-tight">VIP creators</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Top supporters this week are circling these channels.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {vipCreators.map((s) => (
                <Link
                  key={s.id}
                  href={`/u/${s.id}`}
                  className="group lux-glass-hover rounded-2xl overflow-hidden border border-[rgba(255,43,85,0.12)]"
                >
                  <div className="h-36 relative overflow-hidden bg-[#0a0a0a]">
                    <CreatorCardThumbnail
                      creatorId={s.id}
                      posterSrc={resolveStreamerPosterSrc(s, "16x9")}
                      fallbackEmoji={s.avatar}
                      className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <HomeLeaderboardStrip />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lux-glass rounded-2xl p-5 border border-[rgba(255,43,85,0.12)]">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-[hsl(var(--accent-glow))]" />
                <h2 className="font-display text-lg font-bold text-foreground">New collectables</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Access passes, moments, and vouchers.</p>
              <ul className="space-y-3">
                {collectableTeasers.map((c) => (
                  <li
                    key={c.title}
                    className="flex items-center justify-between rounded-xl border border-[rgba(255,43,85,0.1)] bg-black/25 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.sub} · {c.creator}
                      </p>
                    </div>
                    <Button asChild size="sm" variant="secondary" className="rounded-xl text-xs border border-[rgba(255,43,85,0.15)]">
                      <Link href="/marketplace">View</Link>
                    </Button>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="w-full mt-4 rounded-xl border-[rgba(255,43,85,0.25)]">
                <Link href="/marketplace">Collectables market</Link>
              </Button>
            </div>
            <LiveActivityFeed />
          </section>

          <section className="pt-4 border-t border-[rgba(255,43,85,0.1)]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground tracking-tight">Explore creators</h2>
                <p className="text-sm text-muted-foreground mt-1">Filter by vibe. Coins &amp; pools stay under the hood.</p>
              </div>
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Name or creator coin…"
                  className="pl-9 rounded-xl bg-[#111111] border-[rgba(255,43,85,0.2)] focus-visible:ring-[rgba(255,43,85,0.45)]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                type="button"
                size="sm"
                variant={activeCat === "all" ? "default" : "outline"}
                className={cn(
                  "rounded-full text-xs transition-all duration-300",
                  activeCat === "all" && "shadow-lux hover:shadow-lux-lg",
                  activeCat !== "all" && "bg-[#111]/80 border-[rgba(255,43,85,0.2)]",
                )}
                onClick={() => setActiveCat("all")}
              >
                All
              </Button>
              {MARKET_CATEGORIES.map((c) => (
                <Button
                  key={c.id}
                  type="button"
                  size="sm"
                  variant={activeCat === c.id ? "default" : "outline"}
                  className={cn(
                    "rounded-full text-xs transition-all duration-300",
                    activeCat === c.id && "shadow-lux hover:shadow-lux-lg",
                    activeCat !== c.id && "bg-[#111]/80 border-[rgba(255,43,85,0.2)]",
                  )}
                  onClick={() => setActiveCat(c.id)}
                >
                  {c.label}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exploreGrid.map((s) => (
                <StreamerCard key={s.id} {...s} />
              ))}
            </div>
            {filtered.length > 6 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  className="rounded-xl border-[rgba(255,43,85,0.3)]"
                  onClick={() => setShowMoreCreators((v) => !v)}
                >
                  {showMoreCreators ? "Show less" : "Show more creators"}
                </Button>
              </div>
            )}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-12">No creators match your filters.</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
