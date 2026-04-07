import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Monorepo root — Next only reads `apps/web/.env*` by default; load these for shared `NEXT_PUBLIC_*` keys. */
loadEnv({ path: path.join(__dirname, "../../.env") });
loadEnv({ path: path.join(__dirname, "../../.env.local"), override: true });
/** Per-app overrides when present */
loadEnv({ path: path.join(__dirname, ".env.local"), override: true });

const repoRoot = path.join(__dirname, "..", "..");

const nextConfig: NextConfig = {
  transpilePackages: ["@privy-io/react-auth", "@privy-io/wagmi"],
  outputFileTracingRoot: repoRoot,
  /** Radix + hoisted @types/react duplicates cause spurious JSX checks in monorepos; keep strict in IDE. */
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    const empty = path.join(__dirname, "src/shims/empty-module.js");
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": empty,
      "pino-pretty": empty,
      "@farcaster/mini-app-solana": empty,
    };
    return config;
  },
};

export default nextConfig;
