import { ShieldCheck, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ModerationBanner() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Moderated creator marketplace</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Gems hosts music, gaming, education, and more — with AI-assisted moderation, reporting, and category filters.
            Adult content, escorting, and off-platform meeting marketplaces are not allowed.{" "}
            <Link href="/safety" className="text-primary hover:underline">
              Safety &amp; trust →
            </Link>
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="shrink-0 gap-2 rounded-xl">
        <Flag className="w-3.5 h-3.5" />
        Report
      </Button>
    </div>
  );
}
