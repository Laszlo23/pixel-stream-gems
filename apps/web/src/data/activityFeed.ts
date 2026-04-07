export type ActivityKind = "tip" | "lp" | "nft" | "flow" | "clip";

export interface ActivityFeedItem {
  id: string;
  kind: ActivityKind;
  message: string;
  ts: number;
}

const POOL: Omit<ActivityFeedItem, "id" | "ts">[] = [
  { kind: "nft", message: "Maya released a new digital collectable — Access Pass wave" },
  { kind: "flow", message: "Private room opening soon with PixelPanda" },
  { kind: "tip", message: "Top supporter just sent love to ChefVibes" },
  { kind: "clip", message: "New fan joined TalkNight’s inner circle" },
  { kind: "nft", message: "BeatsMaster dropped Signature Cards — limited run" },
  { kind: "tip", message: "Someone sent love during Maya’s midnight set" },
  { kind: "flow", message: "VIP show tonight — a few spots left" },
  { kind: "lp", message: "Support pool for $MAYA hit a new weekly high" },
  { kind: "nft", message: "Fan voucher released — redeemable experience tier" },
  { kind: "clip", message: "Captured moment card sold out in under an hour" },
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
