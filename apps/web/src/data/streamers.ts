import type { MarketCategoryId } from "./categories";

/** Static assets in `public/camgirls/` */
export const CREATOR_MEDIA_DIR = "camgirls";

/** 16:9 tiles (cards, discover, trending, live player, profile header). */
export type PreviewAspect169 = "16x9";

/** Taller tiles (home hero 4:5, profile avatar square). */
export type PreviewAspectPortrait = "portrait";

export type PreviewAspect = PreviewAspect169 | PreviewAspectPortrait;

/** File extension for each `preview-{slot}-*` asset (matches files in `public/camgirls/`). */
export const PREVIEW_SLOT_EXT: Record<string, "png" | "jpeg" | "jpg"> = {
  "01": "jpg",
  "02": "jpg",
  "03": "jpg",
  "04": "jpg",
  "05": "jpg",
  "06": "jpg",
  "07": "jpg",
  "08": "jpg",
  "09": "jpg",
  "10": "jpg",
  "11": "jpg",
  "12": "jpg",
};

/**
 * Full image URL for previews. Uses `thumbnailImage` if set; otherwise
 * `preview-{slot}-{aspect}.{ext}` (e.g. preview-03-16x9.jpeg, preview-01-portrait.png).
 */
export function resolveStreamerPosterSrc(
  s: Pick<StreamerMeta, "id" | "thumbnailImage" | "previewSlot">,
  aspect: PreviewAspect,
): string {
  if (s.thumbnailImage) return s.thumbnailImage;
  const slot = (s.previewSlot ?? "01").padStart(2, "0");
  const ext = PREVIEW_SLOT_EXT[slot] ?? "jpg";
  return `/${CREATOR_MEDIA_DIR}/preview-${slot}-${aspect}.${ext}`;
}

/** Ambient loop: `preview-{slot}-loop.mp4` or overrides. */
export function resolveStreamerAmbientVideoSrc(s: Pick<StreamerMeta, "id" | "ambientVideo" | "previewSlot">): string {
  if (s.ambientVideo) return s.ambientVideo;
  const slot = (s.previewSlot ?? "01").padStart(2, "0");
  return `/${CREATOR_MEDIA_DIR}/preview-${slot}-loop.mp4`;
}

/**
 * Reorder a subset (e.g. a grid row) so neighbours rarely share the same resolved poster URL.
 * If only duplicates remain, fills with whatever is left.
 */
export function orderStreamersAvoidAdjacentSamePoster<T extends Pick<StreamerMeta, "thumbnailImage" | "previewSlot">>(
  items: T[],
  aspect: PreviewAspect,
): T[] {
  if (items.length <= 1) return items;
  const key = (x: T) => resolveStreamerPosterSrc(x, aspect);
  const out: T[] = [];
  const pool = [...items];
  let last: string | null = null;
  while (pool.length) {
    const idx = pool.findIndex((x) => key(x) !== last);
    const next = idx >= 0 ? pool.splice(idx, 1)[0]! : pool.shift()!;
    out.push(next);
    last = key(next);
  }
  return out;
}

/** When only `creatorId` is known (e.g. `CreatorCardThumbnail` without `posterSrc`). */
export function creatorPosterPath(id: string): string {
  return resolveStreamerPosterSrc(getStreamerById(id), "16x9");
}

export function creatorAmbientVideoPath(id: string): string {
  return resolveStreamerAmbientVideoSrc(getStreamerById(id));
}

export type BtcPeg = "cbBTC" | "wBTC" | "tBTC";

export interface StreamerMeta {
  id: string;
  name: string;
  tokenSymbol: string;
  category: string;
  marketCategory: MarketCategoryId;
  viewers: number;
  level: number;
  avatar: string;
  thumbnailColor: string;
  /** Full URL override for all aspects (e.g. `/camgirls/custom.jpg`) */
  thumbnailImage?: string;
  /** Slot `01`…`12` → `preview-{slot}-16x9.*` / `preview-{slot}-portrait.*` */
  previewSlot: string;
  ambientVideo?: string;
  btcPeg: BtcPeg;
  poolTvlUsd: string;
}

export const STREAMERS: StreamerMeta[] = [
  {
    id: "maya",
    name: "Maya",
    tokenSymbol: "MAYA",
    category: "Music • Live",
    marketCategory: "music",
    viewers: 2104,
    level: 24,
    avatar: "✦",
    thumbnailColor: "linear-gradient(145deg, hsl(220 35% 18%), hsl(260 28% 22%))",
    btcPeg: "cbBTC",
    poolTvlUsd: "$48.2K",
    previewSlot: "01",
  },
  {
    id: "pixelpanda",
    name: "PixelPanda",
    tokenSymbol: "PANDA",
    category: "Gaming • Retro",
    marketCategory: "gaming",
    viewers: 1243,
    level: 22,
    avatar: "◆",
    thumbnailColor: "linear-gradient(135deg, hsl(270 30% 20%), hsl(330 30% 20%))",
    btcPeg: "wBTC",
    poolTvlUsd: "$31.0K",
    previewSlot: "02",
  },
  {
    id: "beatsmaster",
    name: "BeatsMaster",
    tokenSymbol: "BEATS",
    category: "Music • Live DJ",
    marketCategory: "music",
    viewers: 892,
    level: 18,
    avatar: "◇",
    thumbnailColor: "linear-gradient(135deg, hsl(175 30% 20%), hsl(200 30% 20%))",
    btcPeg: "tBTC",
    poolTvlUsd: "$22.4K",
    previewSlot: "03",
  },
  {
    id: "codewizard",
    name: "CodeWizard",
    tokenSymbol: "WIZ",
    category: "Tech • Coding",
    marketCategory: "tech",
    viewers: 567,
    level: 15,
    avatar: "◎",
    thumbnailColor: "linear-gradient(135deg, hsl(145 30% 20%), hsl(175 30% 20%))",
    btcPeg: "cbBTC",
    poolTvlUsd: "$18.9K",
    previewSlot: "04",
  },
  {
    id: "chefvibes",
    name: "ChefVibes",
    tokenSymbol: "CHEF",
    category: "Cooking • Live",
    marketCategory: "cooking",
    viewers: 2100,
    level: 28,
    avatar: "○",
    thumbnailColor: "linear-gradient(135deg, hsl(30 30% 20%), hsl(45 40% 20%))",
    btcPeg: "wBTC",
    poolTvlUsd: "$54.1K",
    previewSlot: "05",
  },
  {
    id: "artflow",
    name: "ArtFlow",
    tokenSymbol: "FLOW",
    category: "Art • Digital",
    marketCategory: "art",
    viewers: 456,
    level: 12,
    avatar: "△",
    thumbnailColor: "linear-gradient(135deg, hsl(330 30% 20%), hsl(0 30% 20%))",
    btcPeg: "cbBTC",
    poolTvlUsd: "$12.3K",
    previewSlot: "06",
  },
  {
    id: "talknight",
    name: "TalkNight",
    tokenSymbol: "NIGHT",
    category: "Just Chatting",
    marketCategory: "just_chatting",
    viewers: 3200,
    level: 30,
    avatar: "☽",
    thumbnailColor: "linear-gradient(135deg, hsl(240 25% 18%), hsl(270 25% 18%))",
    btcPeg: "tBTC",
    poolTvlUsd: "$67.8K",
    previewSlot: "07",
  },
  {
    id: "coachriver",
    name: "CoachRiver",
    tokenSymbol: "RIVER",
    category: "Mobility · Strength",
    marketCategory: "fitness",
    viewers: 734,
    level: 19,
    avatar: "⬡",
    thumbnailColor: "linear-gradient(135deg, hsl(150 28% 18%), hsl(185 32% 20%))",
    btcPeg: "cbBTC",
    poolTvlUsd: "$9.8K",
    previewSlot: "08",
  },
  {
    id: "studyloop",
    name: "StudyLoop",
    tokenSymbol: "LOOP",
    category: "Math · Study streams",
    marketCategory: "education",
    viewers: 412,
    level: 14,
    avatar: "◈",
    thumbnailColor: "linear-gradient(135deg, hsl(230 30% 20%), hsl(255 28% 22%))",
    btcPeg: "wBTC",
    poolTvlUsd: "$7.2K",
    previewSlot: "09",
  },
  {
    id: "neonhaven",
    name: "NeonHaven",
    tokenSymbol: "HAVEN",
    category: "Just Chatting • Cozy",
    marketCategory: "just_chatting",
    viewers: 1888,
    level: 21,
    avatar: "✧",
    thumbnailColor: "linear-gradient(135deg, hsl(280 32% 18%), hsl(320 28% 20%))",
    btcPeg: "cbBTC",
    poolTvlUsd: "$14.6K",
    previewSlot: "10",
  },
  {
    id: "quantumkara",
    name: "QuantumKara",
    tokenSymbol: "KARA",
    category: "Music • Synth",
    marketCategory: "music",
    viewers: 956,
    level: 17,
    avatar: "♪",
    thumbnailColor: "linear-gradient(135deg, hsl(200 35% 18%), hsl(240 30% 22%))",
    btcPeg: "wBTC",
    poolTvlUsd: "$11.4K",
    previewSlot: "11",
  },
  {
    id: "bridgebyte",
    name: "BridgeByte",
    tokenSymbol: "BYTE",
    category: "Tech • Web3",
    marketCategory: "tech",
    viewers: 623,
    level: 16,
    avatar: "⬢",
    thumbnailColor: "linear-gradient(135deg, hsl(160 28% 18%), hsl(195 32% 20%))",
    btcPeg: "tBTC",
    poolTvlUsd: "$8.9K",
    previewSlot: "12",
  },
];

const DEMO: StreamerMeta = {
  id: "demo",
  name: "Maya",
  tokenSymbol: "MAYA",
  category: "Music • Live",
  marketCategory: "music",
  viewers: 1243,
  level: 22,
  avatar: "✦",
  thumbnailColor: "linear-gradient(145deg, hsl(220 35% 18%), hsl(260 28% 22%))",
  btcPeg: "cbBTC",
  poolTvlUsd: "$48.2K",
  previewSlot: "01",
};

export function getStreamerById(id: string | undefined): StreamerMeta {
  if (!id) return DEMO;
  const found = STREAMERS.find((s) => s.id === id);
  if (found) return found;
  return { ...DEMO, id };
}
