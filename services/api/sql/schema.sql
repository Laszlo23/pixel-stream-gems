CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS creators (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  token_symbol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS streams (
  id TEXT PRIMARY KEY,
  creator_id TEXT REFERENCES creators (id),
  title TEXT,
  is_live BOOLEAN DEFAULT false,
  viewers INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS competitions_snapshot (
  id SERIAL PRIMARY KEY,
  kind TEXT NOT NULL,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_feed (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  ts BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS chat_phrases (
  id SERIAL PRIMARY KEY,
  room_id TEXT,
  category TEXT NOT NULL CHECK (category IN ('greeting', 'filler', 'hype', 'question')),
  text TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_chat_phrases_room ON chat_phrases (room_id);

CREATE TABLE IF NOT EXISTS compute_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('poster', 'loop')),
  prompt TEXT,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'done', 'failed')),
  result_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compute_jobs_status ON compute_jobs (status);

-- Server-tracked daily streak + XP (SIWE-gated mutations via API)
CREATE TABLE IF NOT EXISTS user_engagement (
  user_id UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  last_claim_on DATE,
  streak_count INTEGER NOT NULL DEFAULT 0,
  total_daily_claims INTEGER NOT NULL DEFAULT 0,
  server_xp INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- First-touch referral attribution (referee can only have one referrer)
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_wallet TEXT NOT NULL,
  referee_wallet TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT referrals_referee_unique UNIQUE (referee_wallet)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_wallet);

-- One-time growth missions per user (e.g. copied invite link)
CREATE TABLE IF NOT EXISTS growth_completions (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  task_kind TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT growth_completions_unique UNIQUE (user_id, task_kind)
);
