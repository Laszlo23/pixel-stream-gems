import type { ReactNode } from "react";
import Link from "next/link";
import { Trophy, Heart, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TOP_LP_LEADERBOARD, TOP_TIPPING_FANS, TOP_TIPPED_CREATORS_WEEK, SUPERFLUID_LEAGUE } from "@/data/competitions";
import { cn } from "@/lib/utils";

interface StripCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

function StripCard({ title, icon, children, className }: StripCardProps) {
  return (
    <div
      className={cn(
        "min-w-[260px] max-w-[280px] rounded-2xl border border-border/60 bg-[#141414]/50 backdrop-blur-md p-4 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-[hsl(var(--accent-glow))]">{icon}</span>
          {title}
        </div>
        <Badge variant="outline" className="text-[9px] rounded-md shrink-0 border-[hsl(var(--primary)/0.3)]">
          This week
        </Badge>
      </div>
      {children}
    </div>
  );
}

export function HomeLeaderboardStrip() {
  return (
    <section className="py-2">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Top supporters</h2>
        <Button variant="outline" size="sm" className="rounded-xl shrink-0 border-border/60" asChild>
          <Link href="/competitions">Competitions</Link>
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Who&apos;s sending love — and who&apos;s feeling it.</p>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        <StripCard title="Most generous fans" icon={<Heart className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {TOP_TIPPING_FANS.slice(0, 3).map((r) => (
              <li key={r.username} className="flex justify-between gap-2">
                <span className="text-muted-foreground w-5">{r.rank}</span>
                <span className="flex-1 truncate font-medium text-foreground">{r.username}</span>
                <span className="text-[hsl(var(--accent-glow))] tabular-nums shrink-0">${r.tipsUsd.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground">
            <Link href="/leaderboards" className="text-[hsl(var(--accent-glow))] hover:underline">
              Full rankings
            </Link>
          </p>
        </StripCard>

        <StripCard title="Most loved creators" icon={<Trophy className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {TOP_TIPPED_CREATORS_WEEK.slice(0, 3).map((r) => (
              <li key={r.id} className="flex justify-between gap-2">
                <span className="text-muted-foreground w-5">{r.rank}</span>
                <Link href={`/u/${r.id}`} className="flex-1 truncate font-medium text-foreground hover:text-[hsl(var(--accent-glow))]">
                  {r.name}
                </Link>
                <span className="text-[hsl(var(--accent-glow))] tabular-nums shrink-0">${(r.tipsUsd / 1000).toFixed(1)}k</span>
              </li>
            ))}
          </ul>
        </StripCard>

        <StripCard title="Largest support pools" icon={<Layers className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {TOP_LP_LEADERBOARD.slice(0, 3).map((r) => (
              <li key={r.wallet} className="flex flex-col gap-0.5">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground w-5">{r.rank}</span>
                  <span className="flex-1 font-mono text-[10px] text-foreground truncate">{r.wallet}</span>
                  <span className="text-[hsl(var(--accent-glow))] shrink-0">{r.liquidityUsd}</span>
                </div>
                <span className="text-[10px] text-muted-foreground pl-5">{r.pool}</span>
              </li>
            ))}
          </ul>
        </StripCard>

        <StripCard title="Steady supporters" icon={<Sparkles className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {SUPERFLUID_LEAGUE.slice(0, 3).map((r) => (
              <li key={r.username} className="flex justify-between gap-2">
                <span className="text-muted-foreground w-5">{r.rank}</span>
                <span className="flex-1 truncate font-medium text-foreground">{r.username}</span>
                <span className="text-[hsl(var(--accent-glow))] tabular-nums shrink-0">${r.streamedUsd}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground">Longest ongoing support streaks</p>
        </StripCard>
      </div>
    </section>
  );
}
