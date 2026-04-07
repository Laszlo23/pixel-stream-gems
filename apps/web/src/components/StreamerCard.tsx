import Link from "next/link";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatorCardThumbnail } from "@/components/creator/CreatorPublicMedia";
import type { StreamerMeta } from "@/data/streamers";
import { resolveStreamerPosterSrc } from "@/data/streamers";

type StreamerCardProps = StreamerMeta & { isLive?: boolean };

const StreamerCard = ({
  id,
  name,
  category,
  viewers,
  avatar,
  previewSlot,
}: StreamerCardProps) => {
  const posterSrc = resolveStreamerPosterSrc({ previewSlot }, "16x9");

  return (
    <div className="surface-card-hover overflow-hidden rounded-2xl group border border-[rgba(255,43,85,0.12)]">
      <Link
        href={`/live/${id}`}
        className="block relative aspect-video overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <CreatorCardThumbnail
          creatorId={id}
          posterSrc={posterSrc}
          fallbackEmoji={avatar}
          className="relative h-full w-full min-h-[140px]"
        />
      </Link>
      <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-[#111111]/90 border-t border-[rgba(255,43,85,0.1)]">
        <Link href={`/u/${id}`} className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1 gap-2">
            <h3 className="font-medium text-foreground truncate group-hover:text-[hsl(var(--accent-glow))] transition-colors duration-300">{name}</h3>
            <div className="flex items-center gap-1 text-muted-foreground shrink-0 text-[11px]">
              <Users className="w-3.5 h-3.5" />
              {viewers.toLocaleString()}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
        </Link>
        <Button asChild size="sm" className="rounded-xl shrink-0 w-full sm:w-auto shadow-lux">
          <Link href={`/live/${id}`}>Watch now</Link>
        </Button>
      </div>
    </div>
  );
};

export default StreamerCard;
