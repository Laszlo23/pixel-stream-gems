import { Bitcoin, Coins, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LiveRoomBottomBarProps {
  tokenSymbol: string;
  btcPeg: string;
  onTip: (amount: number) => void;
  onScrollToSupport: () => void;
  className?: string;
}

const quickTips = [
  { amount: 10, emoji: "🪙" },
  { amount: 50, emoji: "💎" },
  { amount: 100, emoji: "⭐" },
  { amount: 500, emoji: "🔥" },
];

export function LiveRoomBottomBar({
  tokenSymbol,
  btcPeg,
  onTip,
  onScrollToSupport,
  className,
}: LiveRoomBottomBarProps) {
  const buyToken = () => {
    toast.message(`Buy $${tokenSymbol}`, {
      description: `Wire swap / pool: $${tokenSymbol} · ${btcPeg} on Base (demo).`,
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 border-t border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55",
        className,
      )}
    >
      <div className="container mx-auto max-w-[1400px] px-3 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="default"
            size="sm"
            className="rounded-xl gap-2 shrink-0"
            onClick={buyToken}
          >
            <Coins className="w-4 h-4" />
            Buy ${tokenSymbol}
          </Button>
          <Button variant="secondary" size="sm" className="rounded-xl gap-2 shrink-0" onClick={onScrollToSupport}>
            <Waves className="w-4 h-4" />
            Superfluid flow
          </Button>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <Bitcoin className="w-3 h-3" />
            Pool · {btcPeg}
          </span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span className="text-[10px] text-muted-foreground mr-1 w-full sm:w-auto">Tip</span>
          {quickTips.map((t) => (
            <Button
              key={t.amount}
              variant="tip"
              size="sm"
              className="rounded-xl h-9 px-3 text-xs"
              onClick={() => onTip(t.amount)}
            >
              {t.emoji} {t.amount}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
