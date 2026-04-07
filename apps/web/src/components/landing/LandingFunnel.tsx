"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LuxLogo3D } from "@/components/brand/LuxLogo3D";
import { Button } from "@/components/ui/button";
import { CreatorCardThumbnail } from "@/components/creator/CreatorPublicMedia";
import { STREAMERS, orderStreamersAvoidAdjacentSamePoster, resolveStreamerPosterSrc } from "@/data/streamers";
import {
  Coins,
  Crown,
  Lock,
  Radio,
  Sparkles,
  Zap,
  ArrowRight,
  Heart,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DeveloperCredit } from "@/components/DeveloperCredit";
import { BuiltOnStrip } from "@/components/brand/BuiltOnStrip";

const PARTICLE_SEED = [12, 28, 44, 58, 72, 18, 65, 38, 88, 22, 50, 91];

export function LandingFunnel() {
  const preview = useMemo(() => {
    const top = [...STREAMERS].sort((a, b) => b.viewers - a.viewers).slice(0, 6);
    return orderStreamersAvoidAdjacentSamePoster(top, "portrait");
  }, []);

  return (
    <div className="lux-hero-bg min-h-full">
      <div className="lux-particles" aria-hidden>
        {PARTICLE_SEED.map((left, i) => (
          <span
            key={i}
            style={{
              left: `${left}%`,
              animationDuration: `${14 + (i % 5) * 2}s`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* 1 — Hero */}
      <section className="relative z-10 pt-10 pb-16 md:pt-16 md:pb-24 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <LuxLogo3D size="xl" className="mb-10" />
          <div className="badge-subtle mx-auto mb-6 w-fit">
            <Radio className="w-3.5 h-3.5" />
            Live now · Private rooms · Creator coins
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.05]">
            Enter the
            <br />
            <span className="text-gradient">after-hours signal</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light">
            A premium streaming lounge — dark, minimal, electric. VIP energy, seamless tips, and rooms that feel
            one-to-one.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
            <Button asChild size="xl" className="lux-btn-primary rounded-2xl px-10 h-14 text-base min-w-[220px]">
              <Link href="/sign-in" className="gap-2">
                Join free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="rounded-2xl h-14 px-8 border-[rgba(255,43,85,0.35)] bg-[#111111]/80 text-foreground hover:bg-[#161616] hover:border-[rgba(255,43,85,0.55)] hover:shadow-lux transition-all duration-300"
            >
              <Link href="/discover" className="gap-2">
                Enter the Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="rounded-2xl h-14 px-8 border-[rgba(255,43,85,0.35)] bg-[#111111]/80 text-foreground hover:bg-[#161616] hover:border-[rgba(255,43,85,0.55)] hover:shadow-lux transition-all duration-300"
            >
              <Link href="/live/maya">Join a live show</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center max-w-md mx-auto leading-relaxed">
            Free account — email, Apple, Google, or wallet.
          </p>
          <div className="mt-14 h-px max-w-md mx-auto bg-gradient-to-r from-transparent via-[rgba(255,43,85,0.5)] to-transparent animate-lux-line rounded-full" />
        </div>
      </section>

      {/* 2 — Live preview grid */}
      <section id="live" className="relative z-10 py-16 md:py-20 px-4 border-t border-[rgba(255,43,85,0.1)]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Live creators
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Hover thumbnails — soft lift, neon rim. Tap in when the room feels right.
              </p>
            </div>
            <Button variant="ghost" className="text-[hsl(var(--accent-glow))] hover:text-foreground self-start md:self-auto" asChild>
              <Link href="/discover" className="gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {preview.map((s) => (
              <Link
                key={s.id}
                href={`/live/${s.id}`}
                className={cn(
                  "group lux-glass overflow-hidden rounded-2xl border border-[rgba(255,43,85,0.15)]",
                  "lux-thumb-hover",
                )}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a]">
                  <CreatorCardThumbnail
                    creatorId={s.id}
                    mediaVariant="portrait"
                    posterSrc={resolveStreamerPosterSrc(s, "portrait")}
                    fallbackEmoji={s.avatar}
                    className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-2 py-0.5 border border-[rgba(255,43,85,0.35)]">
                    <span className="live-dot scale-90" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-white/95">Live</span>
                  </div>
                </div>
                <div className="px-3 py-3 border-t border-[rgba(255,43,85,0.1)]">
                  <p className="font-semibold text-foreground text-sm truncate">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground tabular-nums">{s.viewers.toLocaleString()} watching</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — How it works */}
      <section className="relative z-10 py-16 md:py-20 px-4 bg-[rgba(0,0,0,0.35)] border-y border-[rgba(255,43,85,0.08)]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center text-foreground mb-4">How it works</h2>
          <p className="text-center text-sm text-muted-foreground max-w-lg mx-auto mb-12">
            Three beats. No clutter.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Arrive",
                body: "Sign in, connect wallet once. You’re in the velvet queue.",
                icon: Sparkles,
              },
              {
                step: "02",
                title: "Choose your room",
                body: "Public stages, tipping ladders, or private sessions — your call.",
                icon: Video,
              },
              {
                step: "03",
                title: "Support & collect",
                body: "Tips, flows, and creator tokens — perks stack for regulars.",
                icon: Heart,
              },
            ].map(({ step, title, body, icon: Icon }) => (
              <div
                key={step}
                className="lux-glass-hover rounded-2xl p-6 text-center md:text-left border border-[rgba(255,43,85,0.12)]"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--accent-glow))] mb-3">
                  {step}
                </p>
                    <Icon className="w-8 h-8 text-primary mb-4 mx-auto md:mx-0 drop-shadow-[0_0_14px_rgba(255,43,85,0.45)]" />
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Tokens & tipping */}
      <section className="relative z-10 py-16 md:py-20 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="badge-subtle w-fit mb-4">
              <Zap className="w-3 h-3" />
              On-chain support
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Tokens, tips &amp; gamification
            </h2>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
              Creator coins anchor the economy. Quick tips hit instantly; Superfluid streams keep the night going.
              Leaderboards and drops reward the ones who show up.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: Coins, t: "Creator tokens", d: "Trade, hold, unlock perks tied to each channel." },
                { icon: Crown, t: "VIP tiers", d: "Priority chat, badges, and private access." },
                { icon: Lock, t: "Private shows", d: "Separate flow for intimate, ticketed sessions." },
              ].map(({ icon: Icon, t, d }) => (
                <li key={t} className="flex gap-4 lux-glass rounded-xl p-4 border border-[rgba(255,43,85,0.1)]">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-[rgba(255,43,85,0.12)] border border-[rgba(255,43,85,0.25)] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[hsl(var(--accent-glow))]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lux-glass rounded-3xl p-8 md:p-10 border border-[rgba(255,43,85,0.2)] relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, rgba(255,43,85,0.4), transparent 50%), radial-gradient(circle at 80% 80%, rgba(196,0,47,0.35), transparent 45%)",
              }}
            />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[hsl(var(--accent-glow))] font-bold mb-2">
                Tonight’s stack
              </p>
              <p className="font-display text-3xl font-bold text-gradient mb-6">Tip · Stream · Collect</p>
              <div className="space-y-3">
                {["Instant tips", "Money streams", "Collectable drops"].map((label, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-xl border border-[rgba(255,43,85,0.15)] bg-black/30 px-4 py-3"
                  >
                    <span className="text-sm text-foreground/90">{label}</span>
                    <span className="text-xs text-muted-foreground font-mono">0{i + 1}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="w-full mt-8 lux-btn-primary rounded-xl h-12">
                <Link href="/marketplace">Explore collectables</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Creator CTA */}
      <section className="relative z-10 py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="lux-glass rounded-3xl p-10 md:p-14 text-center border border-[rgba(255,43,85,0.25)] shadow-lux-lg">
            <h2 className="font-display text-2xl md:text-4xl font-bold text-foreground">Own the spotlight</h2>
            <p className="mt-4 text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Studio dashboard, go-live tools, coin launch, and fan CRM — built for creators who treat every stream like a
              headline set.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="lux-btn-primary rounded-xl h-12 px-8">
                <Link href="/onboarding/creator">Start creator onboarding</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl h-12 px-8 border-[rgba(255,43,85,0.35)] hover:shadow-lux"
              >
                <Link href="/creator">Open studio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Footer band */}
      <footer className="relative z-10 border-t border-[rgba(255,43,85,0.15)] bg-[#050505]/90 backdrop-blur-xl py-12 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/15 shadow-lux"
              style={{ background: "var(--lux-gradient-cta)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-gradient">Gems</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Link href="/legal" className="hover:text-[hsl(var(--accent-glow))] transition-colors font-medium">
              Legal
            </Link>
            <Link href="/legal/terms" className="hover:text-[hsl(var(--accent-glow))] transition-colors">
              Terms
            </Link>
            <Link href="/legal/privacy" className="hover:text-[hsl(var(--accent-glow))] transition-colors">
              Privacy
            </Link>
            <Link href="/legal/cookies" className="hover:text-[hsl(var(--accent-glow))] transition-colors">
              Cookies
            </Link>
            <Link href="/legal/imprint" className="hover:text-[hsl(var(--accent-glow))] transition-colors">
              Imprint
            </Link>
            <Link href="/safety" className="hover:text-[hsl(var(--accent-glow))] transition-colors">
              Safety
            </Link>
            <Link href="/sign-in" className="hover:text-[hsl(var(--accent-glow))] transition-colors font-medium">
              Join free
            </Link>
            <Link href="/settings" className="hover:text-[hsl(var(--accent-glow))] transition-colors">
              Settings
            </Link>
          </nav>
          <div className="flex flex-col gap-2 max-w-md text-center md:text-right">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Dark luxury streaming. Neon crimson, glass panels, and wallet-native support.
            </p>
            <DeveloperCredit compact />
          </div>
        </div>
      </footer>

      <div className="relative z-10 border-t border-[rgba(255,43,85,0.12)] bg-[#030303]/80">
        <div className="container mx-auto max-w-6xl px-4">
          <BuiltOnStrip />
        </div>
      </div>
    </div>
  );
}
