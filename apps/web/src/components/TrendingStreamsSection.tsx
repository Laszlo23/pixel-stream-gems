import Link from "next/link";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { CreatorCardThumbnail } from "@/components/creator/CreatorPublicMedia";
import { TRENDING_CREATORS } from "@/data/trending";
import { getStreamerById, orderStreamersAvoidAdjacentSamePoster, resolveStreamerPosterSrc } from "@/data/streamers";

export function TrendingStreamsSection({ hideHeader }: { hideHeader?: boolean }) {
  const trendingOrdered = useMemo(() => {
    const rows = TRENDING_CREATORS.map((c) => ({ c, m: getStreamerById(c.id) }));
    const orderedM = orderStreamersAvoidAdjacentSamePoster(
      rows.map((r) => r.m),
      "16x9",
    );
    return orderedM.map((m) => rows.find((r) => r.m.id === m.id)!.c);
  }, []);

  return (
    <section className={hideHeader ? "" : "py-8"}>
      {!hideHeader && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[hsl(var(--accent-glow))]" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Trending shows</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">The energy is up in these rooms right now.</p>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {trendingOrdered.map((c) => (
          <Link
            key={c.id}
            href={`/live/${c.id}`}
            className="group rounded-2xl border border-border/60 bg-[#141414]/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[hsl(var(--primary)/0.4)] hover:shadow-[0_0_28px_hsl(var(--primary)/0.12)] hover:-translate-y-0.5"
          >
            <div className="aspect-[16/9] relative bg-[#0A0A0A]">
              <CreatorCardThumbnail
                creatorId={c.id}
                posterSrc={resolveStreamerPosterSrc(getStreamerById(c.id), "16x9")}
                fallbackEmoji={c.avatar}
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <div className="p-3">
              <p className="font-medium text-foreground group-hover:text-[hsl(var(--accent-glow))] transition-colors duration-300">{c.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {c.sparkLabel}: <span className="text-[hsl(var(--accent-glow))] font-semibold">{c.sparkValue}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.tipSpike}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
