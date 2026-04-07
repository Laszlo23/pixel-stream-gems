import { Ticket, ImageIcon, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const collections = [
  {
    key: "access",
    title: "Access passes",
    icon: Ticket,
    desc: "Private streams, VIP chat lanes, and token-gated rooms.",
    perks: ["Stream unlock", "Priority queue", "Season pass"],
    minted: "124 / 500 released",
  },
  {
    key: "moments",
    title: "Moments",
    icon: ImageIcon,
    desc: "Collectible highlights — stills, short clips, and recap media.",
    perks: ["Rare tiers", "Resale", "Show archive"],
    minted: "89 out",
  },
  {
    key: "perks",
    title: "Premium perks",
    icon: Sparkles,
    desc: "Shout-outs, credits, custom requests — redeemed via contract checks.",
    perks: ["On-chain redeem", "Expiry rules", "Creator approval"],
    minted: "32 active",
  },
] as const;

interface NFTDropPanelProps {
  tokenSymbol: string;
  className?: string;
}

export function NFTDropPanel({ tokenSymbol, className }: NFTDropPanelProps) {
  return (
    <div className={cn("surface-card p-4 rounded-2xl", className)}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground tracking-tight">Collectable shelves</h3>
          <p className="text-[11px] text-muted-foreground">
            Three collections per creator · tied to {`$${tokenSymbol}`}
          </p>
        </div>
        <Badge variant="secondary" className="rounded-lg text-[10px]">
          Base
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {collections.map((c) => (
          <div
            key={c.key}
            className="rounded-xl border border-border/70 bg-secondary/30 p-3 flex flex-col gap-2 hover:border-primary/25 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                <c.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-foreground">{c.title}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">{c.desc}</p>
            <ul className="text-[10px] text-muted-foreground space-y-0.5">
              {c.perks.map((p) => (
                <li key={p}>· {p}</li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-[10px] text-primary/90">{c.minted}</span>
              <Button size="sm" variant="outline" className="h-7 text-[10px] rounded-lg">
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
