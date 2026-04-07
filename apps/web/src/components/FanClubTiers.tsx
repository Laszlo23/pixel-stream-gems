import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Crown, Star, Sparkles } from "lucide-react";

interface FanClubTiersProps {
  tokenSymbol: string;
}

const tiers = [
  {
    name: "Supporter",
    icon: Star,
    need: "Hold 100+ tokens or $5/hr avg flow",
    perks: ["Custom chat flair", "Poll votes", "Clip submissions"],
  },
  {
    name: "VIP",
    icon: Sparkles,
    need: "Access pass or 1k+ coins",
    perks: ["Priority chat", "Private room invites", "Monthly drop"],
  },
  {
    name: "Inner circle",
    icon: Crown,
    need: "Top 50 holders + 30d flow streak",
    perks: ["Profile frame", "1:1 office hours", "Governance weight"],
  },
];

export function FanClubTiers({ tokenSymbol }: FanClubTiersProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Fan club tiers</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Loyalty rails for {`$${tokenSymbol}`} — unlock with coin balance, collectables, and ongoing support (enforced in the
        digital registry in production).
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.name} className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                  <t.icon className="w-4 h-4" />
                </div>
                <CardTitle className="text-sm">{t.name}</CardTitle>
              </div>
              <CardDescription className="text-[11px] leading-relaxed">{t.need}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {t.perks.map((p) => (
                <Badge key={p} variant="secondary" className="mr-1 mb-1 rounded-md text-[10px] font-normal">
                  {p}
                </Badge>
              ))}
              <div className="pt-2">
                <p className="text-[10px] text-muted-foreground mb-1">Your progress (demo)</p>
                <Progress value={t.name === "Supporter" ? 72 : t.name === "VIP" ? 38 : 12} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
