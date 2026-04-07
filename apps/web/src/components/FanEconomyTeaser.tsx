import { Eye, MessageCircle, Vote, Droplets, Search, Scissors } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const rows = [
  {
    icon: Eye,
    title: "Engagement mining",
    desc: "Watch, chat, tip, play games, vote — points convert to tokens & NFTs (programmable).",
  },
  {
    icon: Search,
    title: "Early discovery",
    desc: "Back creators before milestones — early supporter badge, bonus allocation, collectible.",
  },
  {
    icon: Droplets,
    title: "Liquidity mining",
    desc: "LP on creator pools — fee share, boosted XP, leaderboard status.",
  },
  {
    icon: Scissors,
    title: "Clip rewards",
    desc: "Fan-made clips that pop split rewards with the creator and surface on home.",
  },
];

export function FanEconomyTeaser() {
  return (
    <Card className="rounded-2xl border-border/80 bg-card/50 backdrop-blur-md h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary" />
          Fan economy
        </CardTitle>
        <CardDescription className="text-xs">Earn without going live — tied to real on-chain actions in production.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((r) => (
          <div key={r.title} className="flex gap-3 rounded-xl border border-border/60 bg-secondary/20 p-3">
            <div className="rounded-lg bg-primary/10 p-2 h-fit text-primary">
              <r.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{r.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{r.desc}</p>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1">
          <Vote className="w-3 h-3" />
          Polls &amp; predictions in chat stack XP toward your fan level.
        </div>
      </CardContent>
    </Card>
  );
}
