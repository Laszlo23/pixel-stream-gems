import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { cn } from "@/lib/utils";

interface StatProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  format?: "compact";
  className?: string;
}

function Stat({ label, value, prefix = "", suffix = "", format, className }: StatProps) {
  const n = useAnimatedNumber(value, 1600);
  const display =
    format === "compact" && n >= 1000
      ? `${(n / 1000).toFixed(1)}k`
      : n.toLocaleString();

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card/50 backdrop-blur-md px-4 py-3 min-w-[140px] flex-1",
        className,
      )}
    >
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-semibold tabular-nums text-foreground">
        {prefix}
        {display}
        {suffix}
      </p>
    </div>
  );
}

export function LivePulseStats() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
        </span>
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Live pulse · last 24h</h2>
      </div>
      <div className="flex flex-wrap gap-3">
        <Stat label="Tips volume" value={128400} prefix="$" format="compact" />
        <Stat label="Active Superfluid flows" value={2401} />
        <Stat label="LP positions opened" value={842} />
        <Stat label="Clips published" value={156} />
      </div>
    </div>
  );
}
