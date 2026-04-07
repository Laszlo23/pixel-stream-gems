import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompetitionBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card/80 to-background p-6 md:p-8">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-primary/20 p-2.5 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Weekly competitions</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Climb leaderboards for tips, creator support, pool liquidity, and Superfluid streaks. Badges, XP, NFTs, and
              homepage features for winners.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="rounded-2xl shrink-0 gap-2">
          <Link to="/competitions">
            Join competitions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
