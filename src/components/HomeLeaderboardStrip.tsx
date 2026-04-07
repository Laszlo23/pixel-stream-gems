import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Trophy, Droplets, Waves, Coins } from "lucide-react";
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
        "min-w-[260px] max-w-[280px] rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-4 flex flex-col gap-3",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <Badge variant="outline" className="text-[9px] rounded-md shrink-0">
          This week
        </Badge>
      </div>
      {children}
    </div>
  );
}

export function HomeLeaderboardStrip() {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Leaderboards</h2>
        <Button variant="outline" size="sm" className="rounded-xl shrink-0" asChild>
          <Link to="/competitions">All competitions</Link>
        </Button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
        <StripCard title="Top tipping fans" icon={<Coins className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {TOP_TIPPING_FANS.slice(0, 3).map((r) => (
              <li key={r.username} className="flex justify-between gap-2">
                <span className="text-muted-foreground w-5">{r.rank}</span>
                <span className="flex-1 truncate font-medium text-foreground">{r.username}</span>
                <span className="text-primary tabular-nums shrink-0">${r.tipsUsd.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground">
            Supporting{" "}
            <Link to="/u/maya" className="text-primary hover:underline">
              creators
            </Link>
          </p>
        </StripCard>

        <StripCard title="Top tipped creators" icon={<Trophy className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {TOP_TIPPED_CREATORS_WEEK.slice(0, 3).map((r) => (
              <li key={r.id} className="flex justify-between gap-2">
                <span className="text-muted-foreground w-5">{r.rank}</span>
                <Link to={`/u/${r.id}`} className="flex-1 truncate font-medium text-foreground hover:text-primary">
                  {r.name}
                </Link>
                <span className="text-primary tabular-nums shrink-0">${(r.tipsUsd / 1000).toFixed(1)}k</span>
              </li>
            ))}
          </ul>
        </StripCard>

        <StripCard title="Biggest liquidity" icon={<Droplets className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {TOP_LP_LEADERBOARD.slice(0, 3).map((r) => (
              <li key={r.wallet} className="flex flex-col gap-0.5">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground w-5">{r.rank}</span>
                  <span className="flex-1 font-mono text-[10px] text-foreground truncate">{r.wallet}</span>
                  <span className="text-primary shrink-0">{r.liquidityUsd}</span>
                </div>
                <span className="text-[10px] text-muted-foreground pl-5">{r.pool}</span>
              </li>
            ))}
          </ul>
        </StripCard>

        <StripCard title="Superfluid league" icon={<Waves className="w-4 h-4" />}>
          <ul className="space-y-2 text-xs">
            {SUPERFLUID_LEAGUE.slice(0, 3).map((r) => (
              <li key={r.username} className="flex justify-between gap-2">
                <span className="text-muted-foreground w-5">{r.rank}</span>
                <span className="flex-1 truncate font-medium text-foreground">{r.username}</span>
                <span className="text-primary tabular-nums shrink-0">${r.streamedUsd}</span>
              </li>
            ))}
          </ul>
          <p className="text-[10px] text-muted-foreground">Longest streaks &amp; streamed value</p>
        </StripCard>
      </div>
    </section>
  );
}
