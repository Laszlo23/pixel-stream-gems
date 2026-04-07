# Engagement API (daily loop, referrals, growth)

Requires Postgres (`DATABASE_URL`) and `npm run db:migrate` so `user_engagement`, `referrals`, and `growth_completions` exist.

## SIWE environment

Challenges use [Sign-In with Ethereum](https://docs.login.xyz/). Set:

- `SIWE_DOMAIN` — browser host only, e.g. `localhost:3000` or `app.yoursite.com` (must match how users open the web app).
- `SIWE_URI` — full origin, e.g. `http://localhost:3000` or `https://app.yoursite.com`.

Mismatch causes signature verification to fail.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/engagement/challenge?address=&chainId=&intent=` | Returns SIWE message to sign. `intent`: `daily_claim`, `referral_bind` (requires `referrer`), `growth_invite_copied`, `growth_room_share`. |
| GET | `/v1/rewards/status?address=` | Streak, `canClaimToday`, `serverXp`, referral count, completed growth tasks. |
| POST | `/v1/rewards/daily-claim` | Body `{ message, signature }`. Idempotent per UTC day. |
| POST | `/v1/referrals/attest` | Body `{ message, signature }` for `referral_bind` challenge. First referee row wins; awards server XP to both sides. |
| POST | `/v1/growth/complete` | Body `{ message, signature, intent }` with `growth_*` intent. One completion per task kind per user. |

## Web client

Set `NEXT_PUBLIC_API_URL` to this API origin. Fan profile shows daily claim + growth tasks; a top strip prompts invitees to sign when `?ref=` or `/join/[code]` was used.
