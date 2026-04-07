import type { MarketCategoryId } from "./categories";

export type BtcPeg = "cbBTC" | "wBTC" | "tBTC";

export interface StreamerMeta {
  id: string;
  name: string;
  tokenSymbol: string;
  /** Legacy display string — keep for cards / headers */
  category: string;
  marketCategory: MarketCategoryId;
  viewers: number;
  level: number;
  avatar: string;
  thumbnailColor: string;
  btcPeg: BtcPeg;
  /** Mock TVL label for demo UI */
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
};

export function getStreamerById(id: string | undefined): StreamerMeta {
  if (!id) return DEMO;
  const found = STREAMERS.find((s) => s.id === id);
  if (found) return found;
  return { ...DEMO, id };
}
