import Link from "next/link";
import { Play } from "lucide-react";
import { VIRAL_CLIPS } from "@/data/trending";

export function ViralClipsTeaser() {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Viral clips</h2>
          <p className="text-sm text-muted-foreground mt-1">Fan edits that drive discovery — rewards split on-chain (demo).</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VIRAL_CLIPS.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-border/80 bg-card/50 backdrop-blur-sm p-4 flex flex-col gap-2 hover:border-primary/25 transition-colors"
          >
            <div className="flex items-center gap-2 text-primary">
              <div className="rounded-full bg-primary/15 p-2">
                <Play className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-foreground line-clamp-2">{c.title}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              by <span className="text-foreground">{c.fanHandle}</span> · {c.views} views
            </p>
            <p className="text-[10px] text-primary">{c.rewardNote}</p>
            <Link href={`/u/${c.creatorId}`} className="text-[10px] text-muted-foreground hover:text-primary">
              {c.creatorName} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
