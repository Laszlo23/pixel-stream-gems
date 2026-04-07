import { cn } from "@/lib/utils";
import { SITE_DEVELOPER } from "@/lib/siteDeveloper";

const link =
  "text-[hsl(var(--accent-glow))] hover:underline underline-offset-2 transition-colors";

type Props = {
  className?: string;
  /** One tight line for landing footer */
  compact?: boolean;
};

export function DeveloperCredit({ className, compact }: Props) {
  if (compact) {
    return (
      <p className={cn("text-[10px] text-muted-foreground text-center md:text-right leading-relaxed", className)}>
        <span className="text-muted-foreground/80">Dev </span>
        <a href={SITE_DEVELOPER.farcasterUrl} target="_blank" rel="noopener noreferrer" className={link}>
          @0xleonardo
        </a>
        <span className="text-muted-foreground/50"> · </span>
        <a href={SITE_DEVELOPER.xUrl} target="_blank" rel="noopener noreferrer" className={link}>
          @bihary41418
        </a>
        <span className="text-muted-foreground/50"> · </span>
        <a
          href={SITE_DEVELOPER.walletExplorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(link, "font-mono")}
          title="Developer wallet (Base)"
        >
          0x502c…C2e1
        </a>
      </p>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Developer</p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        Built by{" "}
        <a href={SITE_DEVELOPER.farcasterUrl} target="_blank" rel="noopener noreferrer" className={link}>
          @0xleonardo
        </a>{" "}
        <span className="text-muted-foreground/60">on Farcaster</span>
        {" · "}
        <a href={SITE_DEVELOPER.xUrl} target="_blank" rel="noopener noreferrer" className={link}>
          @bihary41418
        </a>{" "}
        <span className="text-muted-foreground/60">on X</span>
      </p>
      <p className="text-[11px]">
        <span className="text-muted-foreground">Dev wallet: </span>
        <a
          href={SITE_DEVELOPER.walletExplorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(link, "font-mono text-[10px] break-all")}
        >
          {SITE_DEVELOPER.wallet}
        </a>
      </p>
    </div>
  );
}
