import type { PrivyClientConfig } from "@privy-io/react-auth";
import { base, baseSepolia } from "wagmi/chains";
import { gemsWagmiChains } from "@/lib/chains/gemsWagmiChains";

type LoginMethod = NonNullable<PrivyClientConfig["loginMethods"]>[number];

const ALLOWED_LOGIN: ReadonlySet<string> = new Set<LoginMethod>([
  "wallet",
  "email",
  "sms",
  "google",
  "twitter",
  "discord",
  "github",
  "linkedin",
  "apple",
  "farcaster",
  "telegram",
  "passkey",
]);

const DEFAULT_LOGIN: LoginMethod[] = ["email", "google", "apple", "wallet"];

function parseLoginMethods(): LoginMethod[] {
  const raw = process.env.NEXT_PUBLIC_PRIVY_LOGIN_METHODS?.trim();
  if (!raw) return DEFAULT_LOGIN;
  const parts = raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const out = parts.filter((p): p is LoginMethod => ALLOWED_LOGIN.has(p));
  return out.length > 0 ? out : DEFAULT_LOGIN;
}

function defaultChainFromEnv() {
  const v = process.env.NEXT_PUBLIC_PRIVY_DEFAULT_CHAIN?.trim().toLowerCase();
  if (v === "base" || v === "base-mainnet" || v === "8453") return base;
  if (v === "base-sepolia" || v === "84532") return baseSepolia;
  return baseSepolia;
}

/**
 * Single source of truth for `PrivyProvider` config. Keeps dashboard + env aligned for production.
 */
export function buildPrivyClientConfig(): PrivyClientConfig {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const wc = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim();

  const legal: PrivyClientConfig["legal"] | undefined = siteUrl
    ? {
        termsAndConditionsUrl: `${siteUrl}/legal/terms`,
        privacyPolicyUrl: `${siteUrl}/legal/privacy`,
      }
    : undefined;

  const config: PrivyClientConfig = {
    loginMethods: parseLoginMethods(),
    appearance: {
      theme: "dark",
      accentColor: (process.env.NEXT_PUBLIC_PRIVY_ACCENT_COLOR?.trim() || "#a855f7") as `#${string}`,
      landingHeader: process.env.NEXT_PUBLIC_PRIVY_LANDING_HEADER?.trim() || "Welcome to Gems",
      loginMessage:
        process.env.NEXT_PUBLIC_PRIVY_LOGIN_MESSAGE?.trim() ||
        "Sign in with email, Google, Apple, or your wallet.",
      showWalletLoginFirst: process.env.NEXT_PUBLIC_PRIVY_WALLET_FIRST === "1",
      walletChainType: "ethereum-only",
    },
    embeddedWallets: {
      ethereum: { createOnLogin: "users-without-wallets" },
      showWalletUIs: true,
    },
    supportedChains: [...gemsWagmiChains],
    defaultChain: defaultChainFromEnv(),
  };

  if (legal) {
    config.legal = legal;
  }

  if (wc) {
    config.walletConnectCloudProjectId = wc;
  }

  if (process.env.NEXT_PUBLIC_PRIVY_CAPTCHA_ENABLED === "1") {
    config.captchaEnabled = true;
  }

  return config;
}
