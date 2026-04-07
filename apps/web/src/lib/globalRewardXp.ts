const XP_KEY = "gems.globalXp.v1";

/** Client-only XP bucket for onboarding + referral bonuses (not anti-abuse safe). */
export function getGlobalRewardXp(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(XP_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function addGlobalRewardXp(delta: number): number {
  if (typeof window === "undefined" || !Number.isFinite(delta)) return getGlobalRewardXp();
  const next = Math.max(0, getGlobalRewardXp() + Math.floor(delta));
  localStorage.setItem(XP_KEY, String(next));
  return next;
}
