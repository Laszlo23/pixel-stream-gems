import { Link } from "react-router-dom";
import { Users, Bitcoin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StreamerMeta } from "@/data/streamers";
import { getCategoryShort } from "@/data/categories";

type StreamerCardProps = StreamerMeta & { isLive?: boolean };

const StreamerCard = ({
  id,
  name,
  category,
  viewers,
  level,
  isLive = true,
  avatar,
  thumbnailColor,
  tokenSymbol,
  btcPeg,
  poolTvlUsd,
  marketCategory,
}: StreamerCardProps) => {
  return (
    <div className="surface-card-hover overflow-hidden rounded-2xl group">
      <div
        className="relative aspect-video flex items-center justify-center overflow-hidden"
        style={{ background: thumbnailColor }}
      >
        <Link to={`/u/${id}`} className="absolute inset-0 z-0" aria-label={`${name} profile`} />
        <span className="relative z-[1] pointer-events-none text-5xl opacity-90">{avatar}</span>
        {isLive && (
          <Link
            to={`/live/${id}`}
            className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-destructive/90 px-2.5 py-1 rounded-full hover:bg-destructive transition-colors"
          >
            <div className="live-dot" />
            <span className="text-[11px] font-semibold text-destructive-foreground">LIVE</span>
          </Link>
        )}
        <div className="absolute top-3 right-3 z-[1] flex items-center gap-1 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
          <Users className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-foreground">{viewers.toLocaleString()}</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 z-[1] flex items-center justify-between gap-2 pointer-events-none flex-wrap">
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-[9px] h-5 px-1.5 rounded-md font-normal pointer-events-none">
              {getCategoryShort(marketCategory)}
            </Badge>
            <div className="badge-subtle text-[10px] py-0.5 px-2">${tokenSymbol}</div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-foreground/90 bg-background/60 backdrop-blur-sm px-2 py-1 rounded-lg border border-border/50">
            <Bitcoin className="w-3 h-3" />
            <span>
              / {btcPeg} · {poolTvlUsd}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4 flex items-start justify-between gap-3">
        <Link to={`/u/${id}`} className="min-w-0 flex-1">
          <div className="flex items-center justify-between mb-1 gap-2">
            <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{name}</h3>
            <span className="text-[10px] text-muted-foreground shrink-0">Lv.{level}</span>
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
        </Link>
        <Link to={`/live/${id}`} className="text-xs font-medium text-primary hover:underline shrink-0 pt-0.5">
          Watch →
        </Link>
      </div>
    </div>
  );
};

export default StreamerCard;
