export interface TippingFanRow {
  rank: number;
  username: string;
  creatorName: string;
  creatorId: string;
  tipsUsd: number;
}

export interface TippedCreatorRow {
  rank: number;
  name: string;
  id: string;
  tipsUsd: number;
  flowSupporters: number;
}

export interface LpRow {
  rank: number;
  wallet: string;
  pool: string;
  creatorId: string;
  liquidityUsd: string;
}

export interface SuperfluidLeagueRow {
  rank: number;
  username: string;
  creatorName: string;
  creatorId: string;
  longestStreakHrs: number;
  streamedUsd: number;
}

export const TOP_TIPPING_FANS: TippingFanRow[] = [
  { rank: 1, username: "orbit.eth", creatorName: "Maya", creatorId: "maya", tipsUsd: 8420 },
  { rank: 2, username: "lumen.base", creatorName: "TalkNight", creatorId: "talknight", tipsUsd: 6230 },
  { rank: 3, username: "neon_vault", creatorName: "PixelPanda", creatorId: "pixelpanda", tipsUsd: 5180 },
  { rank: 4, username: "star_404", creatorName: "ChefVibes", creatorId: "chefvibes", tipsUsd: 3920 },
  { rank: 5, username: "waveform", creatorName: "BeatsMaster", creatorId: "beatsmaster", tipsUsd: 2840 },
];

export const TOP_TIPPED_CREATORS_WEEK: TippedCreatorRow[] = [
  { rank: 1, name: "TalkNight", id: "talknight", tipsUsd: 48200, flowSupporters: 312 },
  { rank: 2, name: "ChefVibes", id: "chefvibes", tipsUsd: 39100, flowSupporters: 241 },
  { rank: 3, name: "Maya", id: "maya", tipsUsd: 35600, flowSupporters: 198 },
  { rank: 4, name: "PixelPanda", id: "pixelpanda", tipsUsd: 22400, flowSupporters: 176 },
  { rank: 5, name: "BeatsMaster", id: "beatsmaster", tipsUsd: 18900, flowSupporters: 142 },
];

export const TOP_TIPPED_CREATORS_MONTH: TippedCreatorRow[] = [
  { rank: 1, name: "ChefVibes", id: "chefvibes", tipsUsd: 182000, flowSupporters: 890 },
  { rank: 2, name: "TalkNight", id: "talknight", tipsUsd: 164000, flowSupporters: 720 },
  { rank: 3, name: "Maya", id: "maya", tipsUsd: 128000, flowSupporters: 610 },
  { rank: 4, name: "PixelPanda", id: "pixelpanda", tipsUsd: 97000, flowSupporters: 540 },
  { rank: 5, name: "CodeWizard", id: "codewizard", tipsUsd: 62000, flowSupporters: 380 },
];

export const TOP_LP_LEADERBOARD: LpRow[] = [
  { rank: 1, wallet: "0x71c2…9a2f", pool: "MAYA / cbBTC", creatorId: "maya", liquidityUsd: "$128,400" },
  { rank: 2, wallet: "0x8f31…01bb", pool: "NIGHT / tBTC", creatorId: "talknight", liquidityUsd: "$96,200" },
  { rank: 3, wallet: "0x2aa4…77c1", pool: "CHEF / wBTC", creatorId: "chefvibes", liquidityUsd: "$74,800" },
  { rank: 4, wallet: "0x9d10…3320", pool: "PANDA / wBTC", creatorId: "pixelpanda", liquidityUsd: "$51,300" },
  { rank: 5, wallet: "0x44ab…ff01", pool: "BEATS / tBTC", creatorId: "beatsmaster", liquidityUsd: "$38,900" },
];

export const SUPERFLUID_LEAGUE: SuperfluidLeagueRow[] = [
  { rank: 1, username: "flow_maxi", creatorName: "Maya", creatorId: "maya", longestStreakHrs: 168, streamedUsd: 4200 },
  { rank: 2, username: "drip_hunter", creatorName: "TalkNight", creatorId: "talknight", longestStreakHrs: 142, streamedUsd: 3810 },
  { rank: 3, username: "base_bagel", creatorName: "PixelPanda", creatorId: "pixelpanda", longestStreakHrs: 96, streamedUsd: 2920 },
  { rank: 4, username: "steady_state", creatorName: "ChefVibes", creatorId: "chefvibes", longestStreakHrs: 88, streamedUsd: 2140 },
  { rank: 5, username: "xstream", creatorName: "StudyLoop", creatorId: "studyloop", longestStreakHrs: 72, streamedUsd: 980 },
];

export const COMPETITION_REWARDS = {
  tippingFans: ["Weekly badge", "+2k XP", "Fan pass NFT", "Small $GEM airdrop"],
  tippedCreators: ["Homepage feature", "Featured slot", "Creator drop NFT"],
  lp: ["LP crest badge", "+3k XP", "Fee share boost (demo)"],
  superfluid: ["Supporter crown", "NFT fan pass", "Early access perks"],
} as const;
