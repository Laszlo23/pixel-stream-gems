/** Lightweight output filter for presenter lines (not a substitute for provider moderation). */
const BLOCKED = /\b(escort|onlyfans|nsfw|nude|porn)\b/i;

export function moderatePresenterLine(text: string): string | null {
  const t = text.trim().replace(/\s+/g, " ");
  if (!t || t.length > 400) return null;
  if (BLOCKED.test(t)) return null;
  return t;
}
