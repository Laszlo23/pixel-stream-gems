# Privy — production-ready setup

The app is wired for **Privy + `@privy-io/wagmi`** only (no parallel RainbowKit path). Client config is built in [`src/lib/privyAppConfig.ts`](src/lib/privyAppConfig.ts); transports/RPCs in [`src/lib/wagmi-config.ts`](src/lib/wagmi-config.ts).

## Required

| Variable | Purpose |
|----------|---------|
| **`NEXT_PUBLIC_PRIVY_APP_ID`** | App ID from [dashboard.privy.io](https://dashboard.privy.io). |

Env load order (so this works from the monorepo root): root `.env` → root `.env.local` → `apps/web/.env.local` — see [`next.config.ts`](next.config.ts).

## Strongly recommended for production

| Variable | Purpose |
|----------|---------|
| **`NEXT_PUBLIC_SITE_URL`** | Canonical site URL, no trailing slash (e.g. `https://gems.example.com`). Sets **legal links** inside the Privy modal (terms + privacy) and Next **`metadataBase`** for Open Graph. |
| **`NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`** | Dedicated Base Sepolia HTTPS RPC (Alchemy, Infura, etc.). Falls back to the public RPC if unset. |
| **`NEXT_PUBLIC_BASE_MAINNET_RPC_URL`** | Same for Base mainnet when you point users at `base`. |
| **`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`** | From [WalletConnect Cloud](https://cloud.walletconnect.com) — improves external wallet modal quality (also referenced in `.env.example` as legacy RainbowKit; Privy uses it as `walletConnectCloudProjectId`). |
| **`NEXT_PUBLIC_PRIVY_DEFAULT_CHAIN`** | `base-sepolia` (default) or `base` / `8453` for mainnet-default embedded wallet. |

## Optional branding / behavior

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PRIVY_LOGIN_METHODS` | Comma list, subset of dashboard-enabled methods: e.g. `email,google,apple,wallet`. Must match what you enable in Privy. |
| `NEXT_PUBLIC_PRIVY_ACCENT_COLOR` | Hex accent for Privy UI (default `#a855f7`). |
| `NEXT_PUBLIC_PRIVY_LANDING_HEADER` | Modal title (keep short; Privy recommends ~35 chars). |
| `NEXT_PUBLIC_PRIVY_LOGIN_MESSAGE` | Subtitle under the header. |
| `NEXT_PUBLIC_PRIVY_WALLET_FIRST` | `1` to show external wallet above email/social in the modal. |
| `NEXT_PUBLIC_PRIVY_CAPTCHA_ENABLED` | `1` if you enable CAPTCHA in the Privy dashboard. |

## Server-only (future)

| Variable | Purpose |
|----------|---------|
| **`PRIVY_APP_SECRET`** | Never `NEXT_PUBLIC_*`. Use when you add **server-side** verification (e.g. validating Privy-issued JWTs in Next Route Handlers or `services/api`). Not required for the current client-only flows. |

## Privy dashboard checklist (100% go-live)

1. **Application** — correct **App ID** in env; dev vs prod apps if you split environments.
2. **Allowed origins** — every web origin: `http://localhost:3000`, `http://127.0.0.1:3000`, preview URLs (Vercel), and production `https://…`.
3. **Redirect / callback URLs** — OAuth return URLs for Google, Apple, etc. (per Privy docs for each provider).
4. **Login methods** — enable every method you list in `NEXT_PUBLIC_PRIVY_LOGIN_METHODS` (default: email, Google, Apple, wallet). Methods in code **must** be enabled in the dashboard.
5. **Google / Apple** — OAuth client IDs & secrets completed in Privy; otherwise those buttons fail while email + wallet still work.
6. **Embedded wallets** — on for **Base** and **Base Sepolia** (matches `supportedChains` in code).
7. **Chains** — align dashboard chain allowlist with Base / Base Sepolia.
8. **Legal URLs** — either set in the dashboard or rely on **`NEXT_PUBLIC_SITE_URL`** (code links to `/legal/terms` and `/legal/privacy`).
9. **Captcha / MFA** — enable in dashboard and set `NEXT_PUBLIC_PRIVY_CAPTCHA_ENABLED=1` if you turn CAPTCHA on.
10. **WalletConnect** — project ID in dashboard and in **`NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`**.

## Client behavior included in this repo

- **[`PrivyWalletAutoConnect`](src/components/PrivyWalletAutoConnect.tsx)** — activates the embedded (or first Ethereum) wallet for wagmi after login so the navbar does not stick on “Connect wallet”.
- **[`NavbarAuth`](src/components/navigation/NavbarAuth.tsx)** — **Connect wallet** calls `useActiveWallet().connect()` as a manual fallback.

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Blank screen / “Set NEXT_PUBLIC_PRIVY_APP_ID” | Env not loaded: use root `.env` or `.env.local`, or `apps/web/.env.local`. |
| OAuth errors | Origins, redirect URLs, and provider credentials in Privy. |
| Stuck after sign-in | Click **Connect wallet**; confirm embedded wallets + chains in dashboard. |
| Rate limits / flaky RPC | Set **`NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`** (and mainnet when needed). |

## Wagmi-only fallback

A full app path **without** Privy would require replacing `PrivyProvider` and auditing every `usePrivy` / `useWallets` callsite. Not supported here; keep Privy configured as above.
