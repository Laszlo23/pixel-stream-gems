import { randomBytes } from "node:crypto";
import { SiweMessage } from "siwe";
import type { Pool, PoolClient } from "pg";

type Db = Pool | PoolClient;

type ChallengeRecord = { exp: number; intent: EngagementIntent; referrerWallet?: string };
const challenges = new Map<string, ChallengeRecord>();

export type EngagementIntent = "daily_claim" | "referral_bind" | "growth_invite_copied" | "growth_room_share";

const DAILY_BASE_XP = 40;
const DAILY_STREAK_BONUS_CAP = 10;
const REFERRER_BONUS_XP = 80;
const REFEREE_BONUS_XP = 120;
const GROWTH_TASK_XP: Record<string, number> = {
  invite_link_copied: 25,
  room_share_intent: 25,
};

function utcToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function utcYesterday(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function normalizeWallet(raw: string | undefined): string | null {
  const s = (raw ?? "").trim().toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(s)) return null;
  return s;
}

function siweDomain(): string {
  return process.env.SIWE_DOMAIN?.trim() || "localhost:3000";
}

function siweUri(): string {
  return process.env.SIWE_URI?.trim() || "http://localhost:3000";
}

function statementForIntent(intent: EngagementIntent, referrerWallet?: string): string {
  if (intent === "daily_claim") return "Sign to claim your daily Gems reward and sync your streak.";
  if (intent === "referral_bind") {
    const r = referrerWallet ?? "";
    return `Sign to record referral attribution on Gems (referrer: ${r}).`;
  }
  if (intent === "growth_room_share") return "Sign to complete the share-a-room growth task on Gems.";
  return "Sign to complete the invite-link growth task on Gems.";
}

export function createEngagementChallenge(
  address: string,
  chainId: number,
  intent: EngagementIntent,
  referrerWallet?: string,
): { message: string } {
  const nonce = randomBytes(16).toString("hex");
  challenges.set(nonce, {
    exp: Date.now() + 10 * 60_000,
    intent,
    referrerWallet: referrerWallet ? normalizeWallet(referrerWallet) ?? undefined : undefined,
  });
  const msg = new SiweMessage({
    domain: siweDomain(),
    address,
    statement: statementForIntent(intent, referrerWallet),
    uri: siweUri(),
    version: "1",
    chainId,
    nonce,
    issuedAt: new Date().toISOString(),
  });
  return { message: msg.prepareMessage() };
}

export function growthIntentToTaskKind(intent: EngagementIntent): string | null {
  if (intent === "growth_invite_copied") return "invite_link_copied";
  if (intent === "growth_room_share") return "room_share_intent";
  return null;
}

export async function verifyEngagementSignature(
  message: string,
  signature: string,
  expectedIntent: EngagementIntent,
): Promise<{ address: string; referrerWallet?: string } | null> {
  const siwe = new SiweMessage(message);
  let result;
  try {
    result = await siwe.verify({ signature });
  } catch {
    return null;
  }
  if (!result.success) return null;
  const nonce = siwe.nonce;
  const row = challenges.get(nonce);
  if (!row || row.exp < Date.now()) return null;
  if (row.intent !== expectedIntent) return null;
  challenges.delete(nonce);
  const addr = normalizeWallet(siwe.address);
  if (!addr) return null;
  if (expectedIntent === "referral_bind") {
    const ref = row.referrerWallet ? normalizeWallet(row.referrerWallet) : null;
    if (!ref || ref === addr) return null;
    return { address: addr, referrerWallet: ref };
  }
  return { address: addr };
}

async function ensureUser(db: Db, wallet: string): Promise<string> {
  await db.query(`INSERT INTO users (wallet_address) VALUES ($1) ON CONFLICT (wallet_address) DO NOTHING`, [wallet]);
  const r = await db.query<{ id: string }>(`SELECT id FROM users WHERE wallet_address = $1`, [wallet]);
  return r.rows[0]!.id;
}

async function ensureEngagementRow(db: Db, userId: string): Promise<void> {
  await db.query(`INSERT INTO user_engagement (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING`, [userId]);
}

export type EngagementStatus = {
  streak: number;
  canClaimToday: boolean;
  lastClaimOn: string | null;
  serverXp: number;
  totalDailyClaims: number;
  referralCount: number;
  growthCompleted: string[];
};

export async function getEngagementStatus(pool: Pool, wallet: string): Promise<EngagementStatus | null> {
  const w = normalizeWallet(wallet);
  if (!w) return null;
  const u = await pool.query<{ id: string }>(`SELECT id FROM users WHERE wallet_address = $1`, [w]);
  if (!u.rows[0]) {
    return {
      streak: 0,
      canClaimToday: true,
      lastClaimOn: null,
      serverXp: 0,
      totalDailyClaims: 0,
      referralCount: 0,
      growthCompleted: [],
    };
  }
  const userId = u.rows[0].id;
  const e = await pool.query<{
    last_claim_on: string | null;
    streak_count: number;
    server_xp: number;
    total_daily_claims: number;
  }>(
    `SELECT last_claim_on, streak_count, server_xp, total_daily_claims FROM user_engagement WHERE user_id = $1`,
    [userId],
  );
  const row = e.rows[0];
  if (!row) {
    return {
      streak: 0,
      canClaimToday: true,
      lastClaimOn: null,
      serverXp: 0,
      totalDailyClaims: 0,
      referralCount: Number(
        (await pool.query<{ c: string }>(`SELECT count(*)::text AS c FROM referrals WHERE referrer_wallet = $1`, [w]))
          .rows[0]?.c ?? 0,
      ),
      growthCompleted: [],
    };
  }
  const today = utcToday();
  const canClaimToday = row.last_claim_on !== today;
  const refCount = await pool.query<{ c: string }>(
    `SELECT count(*)::text AS c FROM referrals WHERE referrer_wallet = $1`,
    [w],
  );
  const growth = await pool.query<{ task_kind: string }>(
    `SELECT task_kind FROM growth_completions WHERE user_id = $1`,
    [userId],
  );
  return {
    streak: row.streak_count,
    canClaimToday,
    lastClaimOn: row.last_claim_on,
    serverXp: row.server_xp,
    totalDailyClaims: row.total_daily_claims,
    referralCount: Number(refCount.rows[0]?.c ?? 0),
    growthCompleted: growth.rows.map((x) => x.task_kind),
  };
}

export type DailyClaimResult =
  | { ok: true; alreadyClaimed?: boolean; streak: number; xpAwarded: number; serverXp: number }
  | { ok: false; error: string };

export async function claimDailyReward(pool: Pool, wallet: string): Promise<DailyClaimResult> {
  const w = normalizeWallet(wallet);
  if (!w) return { ok: false, error: "invalid_wallet" };
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userId = await ensureUser(client, w);
    await ensureEngagementRow(client, userId);
    const e = await client.query<{
      last_claim_on: string | null;
      streak_count: number;
      server_xp: number;
      total_daily_claims: number;
    }>(
      `SELECT last_claim_on, streak_count, server_xp, total_daily_claims FROM user_engagement WHERE user_id = $1 FOR UPDATE`,
      [userId],
    );
    const row = e.rows[0]!;
    const today = utcToday();
    if (row.last_claim_on === today) {
      await client.query("COMMIT");
      return {
        ok: true,
        alreadyClaimed: true,
        streak: row.streak_count,
        xpAwarded: 0,
        serverXp: row.server_xp,
      };
    }
    let nextStreak = 1;
    if (row.last_claim_on === utcYesterday()) {
      nextStreak = row.streak_count + 1;
    } else if (row.last_claim_on) {
      nextStreak = 1;
    }
    const bonus = Math.min(nextStreak, DAILY_STREAK_BONUS_CAP) * 10;
    const xpAwarded = DAILY_BASE_XP + bonus;
    const nextXp = row.server_xp + xpAwarded;
    await client.query(
      `UPDATE user_engagement SET last_claim_on = $1::date, streak_count = $2, total_daily_claims = total_daily_claims + 1, server_xp = $3, updated_at = now() WHERE user_id = $4`,
      [today, nextStreak, nextXp, userId],
    );
    await client.query("COMMIT");
    return { ok: true, streak: nextStreak, xpAwarded, serverXp: nextXp };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[claimDailyReward]", err);
    return { ok: false, error: "claim_failed" };
  } finally {
    client.release();
  }
}

export type ReferralAttestResult =
  | { ok: true; created: boolean; refereeXp: number; referrerXp?: number }
  | { ok: false; error: string };

export async function attestReferral(pool: Pool, refereeWallet: string, referrerWallet: string): Promise<ReferralAttestResult> {
  const ref = normalizeWallet(refereeWallet);
  const rer = normalizeWallet(referrerWallet);
  if (!ref || !rer || ref === rer) return { ok: false, error: "invalid_wallets" };
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const existing = await client.query(`SELECT 1 FROM referrals WHERE referee_wallet = $1`, [ref]);
    if (existing.rows.length) {
      await client.query("COMMIT");
      const rid = await ensureUser(pool, ref);
      await ensureEngagementRow(pool, rid);
      const xp = await client.query<{ server_xp: number }>(
        `SELECT server_xp FROM user_engagement WHERE user_id = $1`,
        [rid],
      );
      return { ok: true, created: false, refereeXp: xp.rows[0]?.server_xp ?? 0 };
    }
    await client.query(`INSERT INTO referrals (referrer_wallet, referee_wallet) VALUES ($1, $2)`, [rer, ref]);
    const refereeId = await ensureUser(client, ref);
    const referrerId = await ensureUser(client, rer);
    await ensureEngagementRow(client, refereeId);
    await ensureEngagementRow(client, referrerId);
    await client.query(
      `UPDATE user_engagement SET server_xp = server_xp + $1, updated_at = now() WHERE user_id = $2`,
      [REFEREE_BONUS_XP, refereeId],
    );
    await client.query(
      `UPDATE user_engagement SET server_xp = server_xp + $1, updated_at = now() WHERE user_id = $2`,
      [REFERRER_BONUS_XP, referrerId],
    );
    const rx = await client.query<{ server_xp: number }>(
      `SELECT server_xp FROM user_engagement WHERE user_id = $1`,
      [refereeId],
    );
    await client.query("COMMIT");
    return {
      ok: true,
      created: true,
      refereeXp: rx.rows[0]!.server_xp,
      referrerXp: REFERRER_BONUS_XP,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[attestReferral]", err);
    return { ok: false, error: "referral_failed" };
  } finally {
    client.release();
  }
}

export type GrowthCompleteResult =
  | { ok: true; xpAwarded: number; serverXp: number; alreadyDone?: boolean }
  | { ok: false; error: string };

export async function completeGrowthTask(pool: Pool, wallet: string, taskKind: string): Promise<GrowthCompleteResult> {
  const w = normalizeWallet(wallet);
  if (!w) return { ok: false, error: "invalid_wallet" };
  const xp = GROWTH_TASK_XP[taskKind];
  if (xp === undefined) return { ok: false, error: "unknown_task" };
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const userId = await ensureUser(client, w);
    await ensureEngagementRow(client, userId);
    const ins = await client.query(
      `INSERT INTO growth_completions (user_id, task_kind) VALUES ($1, $2) ON CONFLICT (user_id, task_kind) DO NOTHING RETURNING id`,
      [userId, taskKind],
    );
    if (!ins.rowCount) {
      const cur = await client.query<{ server_xp: number }>(
        `SELECT server_xp FROM user_engagement WHERE user_id = $1`,
        [userId],
      );
      await client.query("COMMIT");
      return {
        ok: true,
        xpAwarded: 0,
        serverXp: cur.rows[0]!.server_xp,
        alreadyDone: true,
      };
    }
    await client.query(
      `UPDATE user_engagement SET server_xp = server_xp + $1, updated_at = now() WHERE user_id = $2`,
      [xp, userId],
    );
    const cur = await client.query<{ server_xp: number }>(
      `SELECT server_xp FROM user_engagement WHERE user_id = $1`,
      [userId],
    );
    await client.query("COMMIT");
    return { ok: true, xpAwarded: xp, serverXp: cur.rows[0]!.server_xp };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("[completeGrowthTask]", err);
    return { ok: false, error: "growth_failed" };
  } finally {
    client.release();
  }
}
