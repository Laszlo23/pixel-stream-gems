/** Allowed creator verticals on Gems — moderated, non-adult. */
export const MARKET_CATEGORIES = [
  { id: "just_chatting", label: "Just chatting", short: "Chat" },
  { id: "gaming", label: "Gaming", short: "Gaming" },
  { id: "music", label: "Music & audio", short: "Music" },
  { id: "tech", label: "Tech & code", short: "Tech" },
  { id: "cooking", label: "Cooking", short: "Cooking" },
  { id: "art", label: "Art & design", short: "Art" },
  { id: "education", label: "Education", short: "Learn" },
  { id: "fitness", label: "Fitness & wellness", short: "Fitness" },
] as const;

export type MarketCategoryId = (typeof MARKET_CATEGORIES)[number]["id"];

export function getCategoryLabel(id: MarketCategoryId): string {
  return MARKET_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryShort(id: MarketCategoryId): string {
  return MARKET_CATEGORIES.find((c) => c.id === id)?.short ?? id;
}
