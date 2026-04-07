import { cn } from "@/lib/utils";
import { stackPartners } from "@/lib/stackPartners";

type BuiltOnStripProps = {
  className?: string;
  /** Tighter padding for inline footer rows */
  compact?: boolean;
};

/**
 * Credibility row: decentralized AI (0G) + Base L2. URLs from NEXT_PUBLIC_STACK_*.
 */
export function BuiltOnStrip({ className, compact }: BuiltOnStripProps) {
  const { zeroGUrl, baseUrl, zeroGLabel, baseLabel } = stackPartners;
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-4",
        compact ? "py-2" : "py-6",
        className,
      )}
    >
      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold text-center sm:text-left">
        Built on
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href={zeroGUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center rounded-full border border-[rgba(255,43,85,0.35)] bg-[#111111]/90 px-4 py-1.5",
            "text-[11px] font-semibold text-foreground hover:border-[rgba(255,43,85,0.6)] hover:shadow-[0_0_20px_rgba(255,43,85,0.15)] transition-all duration-300",
          )}
        >
          {zeroGLabel}
        </a>
        <a
          href={baseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center rounded-full border border-[rgba(255,43,85,0.35)] bg-[#111111]/90 px-4 py-1.5",
            "text-[11px] font-semibold text-foreground hover:border-[rgba(255,43,85,0.6)] hover:shadow-[0_0_20px_rgba(255,43,85,0.15)] transition-all duration-300",
          )}
        >
          {baseLabel}
        </a>
      </div>
    </div>
  );
}
