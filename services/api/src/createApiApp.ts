import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type pg from "pg";
import { SiweMessage } from "siwe";
import { randomBytes } from "node:crypto";
import { competitionsPayload, seedActivityPool } from "./seed.js";
import { buildPresenterLines, type PresenterRequestBody } from "./presenter.js";
import { checkPresenterAsmAccess, isPresenterAsmQuotaRequired } from "./presenterAsmQuota.js";
import { rateLimitAllow } from "./rateLimit.js";
import { enqueueRenderJob } from "./jobs.js";
import {
  attestReferral,
  claimDailyReward,
  completeGrowthTask,
  createEngagementChallenge,
  getEngagementStatus,
  growthIntentToTaskKind,
  normalizeWallet,
  verifyEngagementSignature,
  type EngagementIntent,
} from "./engagement.js";

export type CreateApiAppOptions = {
  pool?: pg.Pool | null;
};

const CORS_RAW = process.env.CORS_ORIGIN ?? "http://localhost:3000,http://127.0.0.1:3000";
const CORS_ORIGINS = CORS_RAW.split(",").map((s) => s.trim()).filter(Boolean);

function safeRoomId(raw: string | undefined): string | null {
  const t = (raw ?? "").trim().toLowerCase();
  if (!/^[a-z0-9-]{1,64}$/.test(t)) return null;
  return t;
}

function clientIp(req: express.Request): string {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0]!.trim();
  return req.socket.remoteAddress ?? "unknown";
}

const ENGAGEMENT_INTENTS: EngagementIntent[] = [
  "daily_claim",
  "referral_bind",
  "growth_invite_copied",
  "growth_room_share",
];

/**
 * Express app factory for production server and integration tests (pass `pool: null` when no DB).
 */
export function createApiApp(options: CreateApiAppOptions = {}): express.Application {
  const pool = options.pool ?? null;

  const app = express();
  app.use(
    cors({
      origin: CORS_ORIGINS.length === 1 ? CORS_ORIGINS[0] : CORS_ORIGINS,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.get("/v1/competitions", async (_req, res) => {
    if (pool) {
      try {
        const r = await pool.query(
          "SELECT payload FROM competitions_snapshot WHERE kind = $1 ORDER BY id DESC LIMIT 1",
          ["full"],
        );
        if (r.rows[0]?.payload) return res.json(r.rows[0].payload);
      } catch {
        /* fall through */
      }
    }
    res.json(competitionsPayload);
  });

  app.get("/v1/activity-feed", async (_req, res) => {
    if (pool) {
      try {
        const r = await pool.query(
          "SELECT id, kind, message, ts FROM activity_feed ORDER BY ts DESC LIMIT 24",
        );
        if (r.rows.length) return res.json({ items: r.rows });
      } catch {
        /* fall through */
      }
    }
    const items = seedActivityPool.map((x, i) => ({
      id: `seed-${i}`,
      kind: x.kind,
      message: x.message,
      ts: Date.now() - i * 60_000,
    }));
    res.json({ items });
  });

  app.post("/v1/rooms/:roomId/presenter-reply", async (req, res) => {
    const roomId = safeRoomId(req.params.roomId);
    if (!roomId) return res.status(400).json({ error: "invalid room" });
    const ip = clientIp(req);
    if (!rateLimitAllow(`presenter:${ip}:${roomId}`, 40, 60_000)) {
      return res.status(429).json({ error: "rate_limited" });
    }
    const body = req.body as PresenterRequestBody;
    if (isPresenterAsmQuotaRequired()) {
      const quota = await checkPresenterAsmAccess(body);
      if (!quota.ok) {
        const code =
          quota.error === "siwe_required" || quota.error === "siwe_invalid"
            ? 401
            : quota.error === "no_purchase"
              ? 402
              : 503;
        return res.status(code).json({ error: quota.error });
      }
    }
    try {
      const lines = await buildPresenterLines({ pool, roomId, body });
      return res.json({ lines });
    } catch (e) {
      console.error("[presenter-reply]", e);
      return res.status(500).json({ error: "presenter_failed" });
    }
  });

  app.post("/v1/jobs/enqueue", async (req, res) => {
    const { roomId, kind, prompt } = req.body as { roomId?: string; kind?: string; prompt?: string };
    const rid = roomId ? safeRoomId(roomId) : null;
    if (!rid || (kind !== "poster" && kind !== "loop")) {
      return res.status(400).json({ error: "invalid body" });
    }
    const out = await enqueueRenderJob(pool, { roomId: rid, kind, prompt });
    if ("error" in out) {
      const code = out.error === "database_unavailable" ? 503 : 500;
      return res.status(code).json(out);
    }
    return res.json(out);
  });

  app.get("/v1/engagement/challenge", (req, res) => {
    if (!pool) return res.status(503).json({ error: "database_unavailable" });
    const address = String(req.query.address ?? "");
    const chainId = Number(req.query.chainId);
    if (!Number.isFinite(chainId) || chainId <= 0) return res.status(400).json({ error: "invalid_chain" });
    const intent = String(req.query.intent ?? "") as EngagementIntent;
    if (!ENGAGEMENT_INTENTS.includes(intent)) return res.status(400).json({ error: "invalid_intent" });
    const referrerRaw = req.query.referrer ? String(req.query.referrer) : undefined;
    if (intent === "referral_bind" && !normalizeWallet(referrerRaw ?? "")) {
      return res.status(400).json({ error: "invalid_referrer" });
    }
    if (!normalizeWallet(address)) return res.status(400).json({ error: "invalid_address" });
    try {
      const { message } = createEngagementChallenge(address, chainId, intent, referrerRaw);
      return res.json({ message });
    } catch {
      return res.status(400).json({ error: "challenge_failed" });
    }
  });

  app.get("/v1/rewards/status", async (req, res) => {
    const w = normalizeWallet(String(req.query.address ?? ""));
    if (!w) return res.status(400).json({ error: "invalid_address" });
    if (!pool) {
      return res.json({
        configured: false,
        streak: 0,
        canClaimToday: true,
        lastClaimOn: null,
        serverXp: 0,
        totalDailyClaims: 0,
        referralCount: 0,
        growthCompleted: [],
      });
    }
    const status = await getEngagementStatus(pool, w);
    if (!status) return res.status(500).json({ error: "status_failed" });
    return res.json({ configured: true, ...status });
  });

  app.post("/v1/rewards/daily-claim", async (req, res) => {
    if (!pool) return res.status(503).json({ error: "database_unavailable" });
    const ip = clientIp(req);
    if (!rateLimitAllow(`daily_claim:${ip}`, 40, 60_000)) return res.status(429).json({ error: "rate_limited" });
    const { message, signature } = req.body as { message?: string; signature?: string };
    if (!message || !signature) return res.status(400).json({ error: "message and signature required" });
    const verified = await verifyEngagementSignature(message, signature, "daily_claim");
    if (!verified) return res.status(401).json({ error: "invalid_signature" });
    const out = await claimDailyReward(pool, verified.address);
    if (!out.ok) return res.status(500).json(out);
    return res.json(out);
  });

  app.post("/v1/referrals/attest", async (req, res) => {
    if (!pool) return res.status(503).json({ error: "database_unavailable" });
    const ip = clientIp(req);
    if (!rateLimitAllow(`referral_attest:${ip}`, 20, 60_000)) return res.status(429).json({ error: "rate_limited" });
    const { message, signature } = req.body as { message?: string; signature?: string };
    if (!message || !signature) return res.status(400).json({ error: "message and signature required" });
    const verified = await verifyEngagementSignature(message, signature, "referral_bind");
    if (!verified?.referrerWallet) return res.status(401).json({ error: "invalid_signature" });
    const out = await attestReferral(pool, verified.address, verified.referrerWallet);
    if (!out.ok) return res.status(500).json(out);
    return res.json(out);
  });

  app.post("/v1/growth/complete", async (req, res) => {
    if (!pool) return res.status(503).json({ error: "database_unavailable" });
    const ip = clientIp(req);
    if (!rateLimitAllow(`growth:${ip}`, 30, 60_000)) return res.status(429).json({ error: "rate_limited" });
    const { message, signature, intent } = req.body as {
      message?: string;
      signature?: string;
      intent?: string;
    };
    if (!message || !signature) return res.status(400).json({ error: "message and signature required" });
    const gi = intent as EngagementIntent;
    if (gi !== "growth_invite_copied" && gi !== "growth_room_share") {
      return res.status(400).json({ error: "invalid_intent" });
    }
    const verified = await verifyEngagementSignature(message, signature, gi);
    if (!verified) return res.status(401).json({ error: "invalid_signature" });
    const taskKind = growthIntentToTaskKind(gi);
    if (!taskKind) return res.status(400).json({ error: "invalid_intent" });
    const out = await completeGrowthTask(pool, verified.address, taskKind);
    if (!out.ok) return res.status(500).json(out);
    return res.json(out);
  });

  app.post("/v1/auth/siwe", async (req, res) => {
    const { message, signature } = req.body as { message?: string; signature?: string };
    if (!message || !signature) return res.status(400).json({ error: "message and signature required" });
    try {
      const siwe = new SiweMessage(message);
      const result = await siwe.verify({ signature });
      if (!result.success) return res.status(401).json({ error: "invalid signature" });
      const sessionId = randomBytes(24).toString("hex");
      const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000);
      if (pool) {
        await pool.query(`INSERT INTO sessions (id, wallet_address, expires_at) VALUES ($1, $2, $3)`, [
          sessionId,
          siwe.address,
          expires,
        ]);
      }
      res.cookie("gems_session", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        expires,
      });
      return res.json({ ok: true, address: siwe.address });
    } catch {
      return res.status(401).json({ error: "verification failed" });
    }
  });

  return app;
}
