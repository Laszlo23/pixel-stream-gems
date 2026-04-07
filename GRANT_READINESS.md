# Grant / demo readiness

Use this before opening a PR, pushing to GitHub, or submitting a grant application.

## Automated verification (run locally)

**Grant / release gate (contracts + builds + API HTTP tests + Playwright smoke + flows):**

```bash
npm run verify:grant
```

Requires Chromium for Playwright (once per machine): `npx playwright install --with-deps chromium`. If port `3000` is busy, use e.g. `PLAYWRIGHT_WEB_PORT=3333 npm run verify:grant`.

**Full stack with fresh Chromium install (CI-like):**

```bash
npm run verify:all
```

**Builds and contracts only (faster, no browser):**

```bash
npm run verify:release
```

**Playwright smoke only** (expects `apps/web` already built, or uses `test:e2e` which builds first):

```bash
npm run test:e2e
```

**API HTTP tests only** (no DB required for the minimal suite; run from repo root):

```bash
npm run test -w api
```

What runs where:

| Script | Forge tests | Web build | API build | API Vitest | Playwright |
|--------|-------------|-----------|-----------|------------|------------|
| `verify:release` | yes | yes | yes | no | no |
| `test:e2e` | no | yes | no | no | yes |
| `verify:grant` | yes | yes | yes | yes | yes (smoke + flows) |
| `verify:all` | yes | yes | yes | no | yes (installs Chromium first) |

**GitHub Actions:** on push/PR to `main` or `master`, [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs `verify:release`, `npm run test -w api`, installs Chromium, then `playwright test`.

**Last known status:** 10 Foundry tests (FeeVault, CreatorToken, NFT staking rewards, factory, ecosystem, agent market); Next production build; API Vitest (`/health`, `/v1/competitions`, presenter idle); Playwright smoke (30 public routes) plus `e2e/flows.spec.ts` (home CTAs, sign-in copy, go-live, onboarding titles).

## Contracts — deploy readiness

| Item | Notes |
|------|--------|
| Compile | `forge build` succeeds |
| Tests | `FeeVault` (1), `CreatorToken` (2), `CreatorTokenFactory` (1), `GemsEcosystem` (3), `AgentSkillMarket` (2), `NFTStakingRewards` (1) — `npm run forge:test` |
| Deploy core | `npm run forge:deploy:sepolia` or `npm run forge:deploy:sepolia:verify` (needs `PRIVATE_KEY`, `BASE_SEPOLIA_RPC_URL`; verify needs `BASESCAN_API_KEY`) |
| Deploy agent market | `npm run forge:deploy:agent-market` / `:verify` (optional) |
| Publish addresses | Fill **[DEPLOYMENTS.md](DEPLOYMENTS.md)** + set `NEXT_PUBLIC_*` in hosting |
| 0G proof | Document public Galileo wallet + `depositFund` tx in `DEPLOYMENTS.md` (no protocol deploy in-repo) |
| Production | Get third-party audit / testnet soak before mainnet TVL |

Forge may print **style warnings** (naming, unchecked transfer hints); they do not fail the build. Consider addressing before a security review.

## App flows — manual QA (Privy + wallet required)

Automated Playwright covers **public shells** only (smoke URLs + marketing/onboarding copy). **Privy sign-up**, **embedded wallet**, and **real on-chain transactions** stay manual (or opt-in E2E with a saved `storageState` and a dedicated Privy test app).

Run **`npm run dev:full`** or at least `npm run dev` with `.env` filled (`NEXT_PUBLIC_PRIVY_APP_ID`, etc.). Walk through:

| Flow | Route / action |
|------|----------------|
| Landing | `/` loads |
| Discover | `/discover` |
| Sign in | `/sign-in` → Privy modal |
| Wallet | After login, address appears (or use **Connect wallet**); see `apps/web/PRIVY_SETUP.md` |
| Fan onboarding | `/onboarding/fan` |
| Creator onboarding | `/onboarding/creator` |
| Profile | `/profile` |
| Creator hub | `/creator` and subpages (`/creator/profile`, `/creator/go-live`, …) |
| Public creator | `/u/maya` (or another id from `streamers`) |
| Live room | `/live/maya` |
| Referral | `/join/testcode` then home |
| Legal | `/legal/terms`, `/safety` |

**Optional backend:** API presenter chat needs `npm run dev:api` + `DATABASE_URL` + `npm run db:migrate -w api`. Live WebSocket chat needs gate + signaling from `dev:full`.

## GitHub / grant hygiene

- **Never commit** `.env` or private keys (already in `.gitignore`).
- Commit **`.env.example`** only with placeholders.
- Add a **README** link to this file and to `README.md` “Production checklist”.
- **Demo video** for grants: 2–3 minutes showing sign-in, discover, live room, creator dashboard.
- **Repo description**: one line + link to live demo (when hosted).

## If `git` errors on macOS

If `git status` complains about the **Xcode license**, run: `sudo xcodebuild -license` once, then retry git.
