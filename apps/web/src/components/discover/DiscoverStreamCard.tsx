"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatorCardThumbnail } from "@/components/creator/CreatorPublicMedia";
import { Users, Heart } from "lucide-react";
import type { StreamerMeta } from "@/data/streamers";
import { resolveStreamerPosterSrc } from "@/data/streamers";

type Props = {
  streamer: StreamerMeta;
  supportLabel?: string;
};

export function DiscoverStreamCard({
  streamer,
  supportLabel = "Support rising",
}: Props) {
  const posterSrc = resolveStreamerPosterSrc(streamer, "16x9");

  return (
    <div className="group relative flex-shrink-0 w-[260px] sm:w-[280px] rounded-2xl overflow-hidden border border-border/60 bg-[#141414]/45 backdrop-blur-md transition-all duration-300 hover:border-[hsl(var(--primary)/0.45)] hover:shadow-[0_0_32px_hsl(var(--primary)/0.18)] hover:-translate-y-0.5">
      <Link href={`/live/${streamer.id}`} className="block h-[140px] relative overflow-hidden">
        <CreatorCardThumbnail
          creatorId={streamer.id}
          posterSrc={posterSrc}
          fallbackEmoji={streamer.avatar}
          className="h-full w-full"
        />
      </Link>
      <div className="p-3 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground leading-tight">{streamer.name}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{streamer.category}</p>
          </div>
          <Badge variant="secondary" className="rounded-md font-mono text-[10px] shrink-0 bg-black/40">
            ${streamer.tokenSymbol}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Users className="w-3.5 h-3.5 text-[hsl(var(--accent-glow))]" />
          <span className="tabular-nums text-foreground font-medium">{streamer.viewers.toLocaleString()}</span>
          <span>watching</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <Heart className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
          <span className="text-foreground/90">{supportLabel}</span>
        </div>
        <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent-glow))] shadow-[0_0_12px_hsl(var(--primary)/0.5)] transition-all duration-500"
            style={{ width: `${Math.min(100, 35 + (streamer.viewers % 55))}%` }}
          />
        </div>
        <Button asChild className="w-full rounded-xl" size="sm">
          <Link href={`/live/${streamer.id}`}>Watch now</Link>
        </Button>
      </div>
    </div>
  );
}
