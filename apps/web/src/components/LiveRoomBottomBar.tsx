import Link from "next/link";
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
  const swapUrl =
    process.env.NEXT_PUBLIC_SWAP_URL ??
    `https://aerodrome.finance/swap?from=eth&to=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(255,43,85,0.15)] bg-[#070707]/88 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#070707]/75 shadow-[0_-12px_40px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div className="container mx-auto max-w-[1400px] px-3 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="default" size="sm" className="rounded-xl gap-2 shrink-0" asChild>
            <Link
              href={swapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
              onClick={() =>
                toast.message(`Buy $${tokenSymbol}`, {
                  description: `Opening Base swap — pair with ${btcPeg}.`,
                })
              }
            >
              <Coins className="w-4 h-4" />
              Buy ${tokenSymbol}
            </Link>
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
