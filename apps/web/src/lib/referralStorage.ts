const PENDING_KEY = "gems.referral.pending.v1";
const CLAIMED_KEY = "gems.referral.bonusClaimed.v1";

export type PendingReferral = { code: string; capturedAt: string };

function sanitizeCode(raw: string): string | null {
  const s = raw.trim().slice(0, 48);
  if (!s || s.length < 2) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(s)) return null;
  return s;
}

/** Call on client when URL contains ?ref= or /join/[code] */
export function storePendingReferral(code: string) {
  const c = sanitizeCode(code);
  if (!c || typeof window === "undefined") return;
  const payload: PendingReferral = { code: c, capturedAt: new Date().toISOString() };
  localStorage.setItem(PENDING_KEY, JSON.stringify(payload));
}

export function getPendingReferral(): PendingReferral | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as PendingReferral;
    if (j?.code && j?.capturedAt) return j;
  } catch {
    /* ignore */
  }
  return null;
}

export function clearPendingReferral() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_KEY);
}

export function hasClaimedReferralBonus(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CLAIMED_KEY) === "1";
}

export function markReferralBonusClaimed() {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLAIMED_KEY, "1");
}
