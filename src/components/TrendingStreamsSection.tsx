import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TRENDING_CREATORS } from "@/data/trending";

export function TrendingStreamsSection() {
  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Trending streams</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Fastest-growing channels, tip spikes, and breakout discovery — updated live (demo).
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TRENDING_CREATORS.map((c) => (
          <Link
            key={c.id}
            to={`/live/${c.id}`}
            className="group rounded-2xl border border-border/80 bg-card/50 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-colors"
          >
            <div
              className="aspect-[16/9] flex items-center justify-center text-4xl relative"
              style={{ background: c.thumbnailColor }}
            >
              {c.avatar}
              <Badge className="absolute top-2 right-2 rounded-lg text-[10px] animate-pulse">Hot</Badge>
            </div>
            <div className="p-3">
              <p className="font-medium text-foreground group-hover:text-primary transition-colors">{c.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                {c.sparkLabel}: <span className="text-primary font-semibold">{c.sparkValue}</span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{c.tipSpike}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
