/**
 * Public “Built on” links for marketing footer / landing. Override via env in production.
 */
const DEFAULT_ZERO_G = "https://www.0g.ai";
const DEFAULT_BASE = "https://www.base.org";

function trimUrl(raw: string | undefined, fallback: string): string {
  const u = raw?.trim();
  if (!u) return fallback;
  try {
    const parsed = new URL(u);
    return parsed.toString().replace(/\/$/, "") || fallback;
  } catch {
    return fallback;
  }
}

export const stackPartners = {
  zeroGUrl: trimUrl(process.env.NEXT_PUBLIC_STACK_ZERO_G_URL, DEFAULT_ZERO_G),
  baseUrl: trimUrl(process.env.NEXT_PUBLIC_STACK_BASE_URL, DEFAULT_BASE),
  /** Short labels for pills / links */
  zeroGLabel: "0G",
  baseLabel: "Base",
} as const;
