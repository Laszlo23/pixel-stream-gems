# Gems (pixel-stream-gems)

Monorepo: **Next.js** app (`apps/web`), **Foundry** contracts (`packages/contracts`), **WebSocket signaling** (`services/signaling`), **room gate** (`services/gate`), and optional **API + Postgres** (`services/api`).

## Prerequisites

- Node.js 20+
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`)

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` (at least **`NEXT_PUBLIC_PRIVY_APP_ID`** for auth, RPC URLs, optional contract addresses). See `.env.example`. Privy setup: [apps/web/PRIVY_SETUP.md](apps/web/PRIVY_SETUP.md).

## Local development

**One command (web + API + gate + signaling):**

```bash
npm run dev:full
```

Or run services in separate terminals:

| Service | Command | Notes |
|--------|---------|--------|
| Next.js | `npm run dev` | [http://localhost:3000](http://localhost:3000) — use the same host in the URL you whitelist in Privy |
| Signaling | `npm run dev:signaling` | WebRTC (`ws://127.0.0.1:4001`) |
| Gate | `npm run dev:gate` | JWTs for rooms (`POST /v1/room-token`) |
| API (optional) | `npm run dev:api` | Competitions, activity, presenter chat; run `npm run db:migrate -w api` if using Postgres |

Contracts:

```bash
npm run forge:test
npm run forge:build
```

Deploy to Base Sepolia (sources root `.env` for `PRIVATE_KEY`, `BASE_SEPOLIA_RPC_URL`, and optional `BASESCAN_API_KEY`):

```bash
npm run forge:deploy:sepolia
npm run forge:deploy:sepolia:verify   # same + Basescan verification
npm run forge:deploy:agent-market       # optional: AgentSkillMarket.sol
npm run forge:deploy:agent-market:verify
```

After deploy, record addresses and tx hashes in **[DEPLOYMENTS.md](DEPLOYMENTS.md)** and set the `NEXT_PUBLIC_*` contract variables in `.env` / hosting (see `.env.example`).

Copy ABIs from `packages/contracts/out` into `apps/web/src/lib/abis/` after deploy if the UI needs them.

## Pre-release / grant checklist

```bash
npm run verify:release   # contracts + Next + API builds
npm run test:e2e         # Playwright smoke on production Next server
npm run verify:all       # everything above + browser install + e2e
```

GitHub Actions runs build verification and Playwright on pushes/PRs to `main` or `master`. See **[GRANT_READINESS.md](GRANT_READINESS.md)** for manual Privy QA and grant hygiene.

## Production checklist

1. **Web** — host `apps/web` (e.g. Vercel); set env vars from `.env.example` (`NEXT_PUBLIC_*`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GATE_URL`, `NEXT_PUBLIC_SIGNALING_WS`, production URLs).
2. **Privy** — `NEXT_PUBLIC_PRIVY_APP_ID`, optional `NEXT_PUBLIC_SITE_URL` (legal links + OG metadata), dedicated RPC envs, WalletConnect project ID. Full checklist: [apps/web/PRIVY_SETUP.md](apps/web/PRIVY_SETUP.md).
3. **API** — deploy `services/api` with `DATABASE_URL`, `CORS_ORIGIN` matching the web origin(s), `XAI_API_KEY` if using presenter chat.
4. **Gate + signaling** — deploy with `JWT_SECRET`, chain RPC, and URLs wired in the web app.
5. **Contracts** — deploy with `forge:deploy:sepolia` (and optional agent market); verify on Basescan; paste addresses into web env and **[DEPLOYMENTS.md](DEPLOYMENTS.md)**. For 0G Galileo, document the public server wallet and ledger deposit tx in `DEPLOYMENTS.md` (see [services/api/COMPUTE_AND_PRESENTER.md](services/api/COMPUTE_AND_PRESENTER.md)).

## TURN (production WebRTC)

See `services/signaling/TURN.md` for STUN/TURN notes. Set `NEXT_PUBLIC_TURN_JSON` in the web app when you have relay credentials.

## Layout

- `apps/web` — App Router, wagmi/RainbowKit, Superfluid wiring, `WebRtcRoom`
- `packages/contracts` — token factory, `FeeVault`, NFT factories, `GemsMarketplace`, `AgentSkillMarket` (agent skill purchases), platform token, staking, registry (see `packages/contracts/README.md`)
- `services/signaling` — JWT-authenticated WS rooms
- `services/gate` — token balance + optional Superfluid flow checks before signaling
- `services/api` — REST stubs, SIWE placeholder, `sql/schema.sql`

The legacy Vite UI remains under the repo root `src/` (e.g. `npm run dev` in that package if still present); primary product path is `apps/web`.
