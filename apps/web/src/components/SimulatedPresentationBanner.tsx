import { Sparkles } from "lucide-react";

/** Disclosure for demo / synthetic rooms — viewers should not assume a live human broadcaster. */
export function SimulatedPresentationBanner() {
  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3 flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-primary/15 p-2 text-primary">
        <Sparkles className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Simulated / AI-assisted presentation</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          This room may use generated or stock media and an AI room assistant for chat. It is for demonstration — not a claim of a
          real-time human stream unless separately labeled.
        </p>
      </div>
    </div>
  );
}
