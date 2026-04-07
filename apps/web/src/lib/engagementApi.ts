const CHALLENGE_PATH = "/v1/engagement/challenge";
const STATUS_PATH = "/v1/rewards/status";
const DAILY_CLAIM_PATH = "/v1/rewards/daily-claim";
const REFERRAL_ATTEST_PATH = "/v1/referrals/attest";
const GROWTH_COMPLETE_PATH = "/v1/growth/complete";

function apiBase(): string | null {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  return u && u.length > 0 ? u.replace(/\/$/, "") : null;
}

export function isEngagementApiConfigured(): boolean {
  return apiBase() !== null;
}

export type RewardsStatusResponse =
  | {
      configured: false;
      streak: number;
      canClaimToday: boolean;
      lastClaimOn: string | null;
      serverXp: number;
      totalDailyClaims: number;
      referralCount: number;
      growthCompleted: string[];
    }
  | {
      configured: true;
      streak: number;
      canClaimToday: boolean;
      lastClaimOn: string | null;
      serverXp: number;
      totalDailyClaims: number;
      referralCount: number;
      growthCompleted: string[];
    };

export async function fetchRewardsStatus(address: string): Promise<RewardsStatusResponse | null> {
  const base = apiBase();
  if (!base) return null;
  const url = `${base}${STATUS_PATH}?address=${encodeURIComponent(address)}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as RewardsStatusResponse;
}

export type EngagementIntent =
  | "daily_claim"
  | "referral_bind"
  | "growth_invite_copied"
  | "growth_room_share";

export async function fetchEngagementChallenge(
  address: string,
  chainId: number,
  intent: EngagementIntent,
  referrerWallet?: string,
): Promise<{ message: string } | null> {
  const base = apiBase();
  if (!base) return null;
  const q = new URLSearchParams({
    address,
    chainId: String(chainId),
    intent,
  });
  if (referrerWallet) q.set("referrer", referrerWallet);
  const res = await fetch(`${base}${CHALLENGE_PATH}?${q}`, { method: "GET", cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as { message: string };
}

export async function postDailyClaim(message: string, signature: string) {
  const base = apiBase();
  if (!base) return null;
  const res = await fetch(`${base}${DAILY_CLAIM_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature }),
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    ok: true;
    alreadyClaimed?: boolean;
    streak: number;
    xpAwarded: number;
    serverXp: number;
  };
}

export async function postReferralAttest(message: string, signature: string) {
  const base = apiBase();
  if (!base) return null;
  const res = await fetch(`${base}${REFERRAL_ATTEST_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature }),
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    ok: true;
    created: boolean;
    refereeXp: number;
    referrerXp?: number;
  };
}

export async function postGrowthComplete(message: string, signature: string, intent: EngagementIntent) {
  const base = apiBase();
  if (!base) return null;
  const res = await fetch(`${base}${GROWTH_COMPLETE_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, signature, intent }),
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    ok: true;
    xpAwarded: number;
    serverXp: number;
    alreadyDone?: boolean;
  };
}
