export type ActivityKind = "tip" | "lp" | "nft" | "flow" | "clip";

export interface ActivityFeedItem {
  id: string;
  kind: ActivityKind;
  message: string;
  ts: number;
}

const POOL: Omit<ActivityFeedItem, "id" | "ts">[] = [
  { kind: "flow", message: "Alex started streaming $0.20/min to Maya" },
  { kind: "tip", message: "User123 sent a 500 coin tip to PixelPanda" },
  { kind: "lp", message: "0x71c2…9a2f added liquidity to $MAYA / cbBTC" },
  { kind: "nft", message: "PixelPanda sold 20 access pass NFTs in 6 minutes" },
  { kind: "clip", message: "clip_fairy’s highlight hit trending — +120 XP" },
  { kind: "flow", message: "steady_state opened $5/hr flow to ChefVibes" },
  { kind: "tip", message: "MegaTip: 2,000 coins to TalkNight during poll" },
  { kind: "nft", message: "New Moment drop: Maya — “Studio night #12”" },
  { kind: "lp", message: "base_bagel widened $PANDA / wBTC range" },
  { kind: "clip", message: "Creator + fan split: viral clip reward queued" },
];

let seq = 0;

export function randomFeedItem(): ActivityFeedItem {
  const pick = POOL[Math.floor(Math.random() * POOL.length)]!;
  seq += 1;
  return {
    ...pick,
    id: `evt-${Date.now()}-${seq}`,
    ts: Date.now(),
  };
}
