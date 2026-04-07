import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import StreamerCard from "@/components/StreamerCard";
import { ModerationBanner } from "@/components/ModerationBanner";
import { LivePulseStats } from "@/components/LivePulseStats";
import { HomeLeaderboardStrip } from "@/components/HomeLeaderboardStrip";
import { CompetitionBanner } from "@/components/CompetitionBanner";
import { TrendingStreamsSection } from "@/components/TrendingStreamsSection";
import { ViralClipsTeaser } from "@/components/ViralClipsTeaser";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { FanEconomyTeaser } from "@/components/FanEconomyTeaser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Zap, Users, Droplets, Layers, Shield, Radio, Hexagon, Search } from "lucide-react";
import { STREAMERS } from "@/data/streamers";
import { MARKET_CATEGORIES, type MarketCategoryId } from "@/data/categories";
import { cn } from "@/lib/utils";

const features = [
  { icon: Radio, title: "Live marketplace", desc: "Discover creators by category — stream, chat, and collect in one layout." },
  { icon: Droplets, title: "Superfluid support", desc: "Per-minute or hourly flows on Base; Live Support Meter shows who’s streaming value." },
  { icon: Layers, title: "Tokens + BTC pools", desc: "Each creator token pairs with cbBTC, wBTC, or tBTC for calmer price rails." },
  { icon: Shield, title: "Trust by design", desc: "Reporting, AI-assisted moderation, category filters — see Safety & trust for details." },
];

const Index = () => {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<MarketCategoryId | "all">("all");

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

  return (
    <div className="min-h-screen bg-background hero-mesh">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <div className="badge-subtle mb-6 mx-auto w-fit animate-fade-in">
            <Zap className="w-3 h-3" />
            Creator marketplace · Base · Superfluid
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-foreground mb-4 animate-fade-in leading-[1.1] tracking-tight">
            Your economy,
            <br />
            <span className="text-gradient">your stream.</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 animate-fade-in max-w-lg mx-auto leading-relaxed">
            Browse creators by category, support them with flowing crypto, and unlock NFT passes — in a clean, moderated
            experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
            <Link to="/live/maya">
              <Button size="xl" className="rounded-2xl w-full sm:w-auto">
                <Users className="w-5 h-5 mr-1" />
                Watch live
              </Button>
            </Link>
            <Button asChild variant="outline" size="xl" className="rounded-2xl w-full sm:w-auto bg-background/40 backdrop-blur-sm">
              <Link to="/creator">Creator dashboard</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="rounded-2xl w-full sm:w-auto bg-background/40 backdrop-blur-sm">
              <Link to="/competitions">Competitions</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <div className="container mx-auto max-w-6xl space-y-8">
          <LivePulseStats />
          <HomeLeaderboardStrip />
          <CompetitionBanner />
          <TrendingStreamsSection />
          <ViralClipsTeaser />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
            <div className="lg:col-span-3 min-h-0">
              <LiveActivityFeed />
            </div>
            <div className="lg:col-span-2 min-h-0">
              <FanEconomyTeaser />
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="container mx-auto max-w-3xl">
          <ModerationBanner />
        </div>
      </section>

      <section className="py-12 px-4" id="marketplace">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-foreground tracking-tight">Creator marketplace</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Filter by category. Every channel has a creator token and BTC-pegged pool story.
              </p>
            </div>
            <div className="relative w-full lg:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or $SYMBOL…"
                className="pl-9 rounded-xl bg-card/80 border-border/80 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <Button
              type="button"
              size="sm"
              variant={activeCat === "all" ? "default" : "outline"}
              className={cn("rounded-full text-xs", activeCat === "all" ? "" : "bg-background/40 backdrop-blur-sm")}
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
                className={cn("rounded-full text-xs", activeCat === c.id ? "" : "bg-background/40 backdrop-blur-sm")}
                onClick={() => setActiveCat(c.id)}
              >
                {c.label}
              </Button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-16">No creators match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((s) => (
                <StreamerCard key={s.id} {...s} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-xl font-semibold text-foreground mb-2 tracking-tight">Why Gems</h2>
          <p className="text-sm text-muted-foreground mb-10">Apple-quiet UI · Web3 rails · creator-first</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {features.map((f) => (
              <div
                key={f.title}
                className="surface-card p-6 rounded-2xl hover:border-primary/20 transition-colors bg-card/50 backdrop-blur-sm border-border/80"
              >
                <f.icon className="w-5 h-5 mb-3 text-primary" />
                <h3 className="font-medium text-foreground mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-lg">
          <div className="surface-card p-10 rounded-3xl border-border/80 bg-card/60 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">Connect on Base</h2>
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Use any EVM wallet. Superfluid streams and pools deploy on Base — wire contracts when you are ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="xl" className="rounded-2xl">
                <Link to="/profile">Fan profile</Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="rounded-2xl bg-background/30 backdrop-blur-sm">
                <Link to="/safety">Safety &amp; trust</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/80 py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Hexagon className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm text-foreground">Gems</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Gems. Demo UI — connect contracts for production.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
