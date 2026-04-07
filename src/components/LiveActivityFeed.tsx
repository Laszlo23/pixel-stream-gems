import { useEffect, useState } from "react";
import { Radio, Gift, Droplets, Waves, Scissors } from "lucide-react";
import { randomFeedItem, type ActivityFeedItem, type ActivityKind } from "@/data/activityFeed";
import { cn } from "@/lib/utils";

const icons: Record<ActivityKind, React.ReactNode> = {
  tip: <Gift className="w-3.5 h-3.5" />,
  lp: <Droplets className="w-3.5 h-3.5" />,
  nft: <Radio className="w-3.5 h-3.5" />,
  flow: <Waves className="w-3.5 h-3.5" />,
  clip: <Scissors className="w-3.5 h-3.5" />,
};

export function LiveActivityFeed() {
  const [items, setItems] = useState<ActivityFeedItem[]>(() => {
    const initial: ActivityFeedItem[] = [];
    for (let i = 0; i < 6; i++) initial.push(randomFeedItem());
    return initial;
  });

  useEffect(() => {
    const t = window.setInterval(() => {
      setItems((prev) => {
        const next = [randomFeedItem(), ...prev].slice(0, 12);
        return next;
      });
    }, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border/80 bg-card/50 backdrop-blur-md overflow-hidden flex flex-col h-full min-h-[320px]">
      <div className="px-4 py-3 border-b border-border/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Live activity</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Simulated feed</span>
      </div>
      <ul className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[360px]">
        {items.map((item, i) => (
          <li
            key={item.id}
            className={cn(
              "flex gap-2 rounded-xl px-3 py-2 text-xs text-muted-foreground border border-transparent",
              i === 0 && "bg-primary/5 border-primary/15 text-foreground animate-fade-in",
            )}
          >
            <span className="text-primary shrink-0 mt-0.5">{icons[item.kind]}</span>
            <span className="leading-snug">{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
