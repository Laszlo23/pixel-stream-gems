/**
 * Local operator CLI for 0G compute ledger (never paste private keys into chat).
 * Loads repo root `.env` when present; you can also `set -a; source ../../.env; set +a` from `services/api`.
 *
 * Usage (from repo root):
 *   npm run zg:ledger -w api -- status
 *   npm run zg:ledger -w api -- deposit 0.05
 */
import { config } from "dotenv";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { JsonRpcProvider, Wallet } from "ethers";

/** CJS entry — the package's ESM bundle fails under tsx/Node in some versions. */
const require = createRequire(import.meta.url);
const { createZGComputeNetworkBroker } = require("@0glabs/0g-serving-broker") as typeof import("@0glabs/0g-serving-broker");

const scriptDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(scriptDir, "..");
const repoRoot = resolve(apiRoot, "../..");

config({ path: resolve(repoRoot, ".env"), quiet: true });
config({ path: resolve(apiRoot, ".env"), quiet: true });

function normalizePrivateKey(raw: string): string {
  const s = raw.trim();
  return s.startsWith("0x") ? s : `0x${s}`;
}

function usage(): void {
  console.info(`Usage:
  npm run zg:ledger -w api -- status
  npm run zg:ledger -w api -- deposit <amount>

Environment (server-only, in .env):
  ZG_RPC_URL             e.g. https://evmrpc-testnet.0g.ai
  ZG_WALLET_PRIVATE_KEY  hot wallet with native 0G on that chain

<amount> is in 0G token units (see 0G SDK ledger.depositFund).`);
}

async function createBroker() {
  const rpc = process.env.ZG_RPC_URL?.trim();
  const pk = process.env.ZG_WALLET_PRIVATE_KEY?.trim();
  if (!rpc || !pk) {
    console.error("[zg-ledger] Missing ZG_RPC_URL or ZG_WALLET_PRIVATE_KEY in environment.");
    process.exit(1);
  }
  const provider = new JsonRpcProvider(rpc);
  const wallet = new Wallet(normalizePrivateKey(pk), provider);
  return createZGComputeNetworkBroker(wallet as never);
}

async function cmdStatus(): Promise<void> {
  const broker = await createBroker();
  const ledger = await broker.ledger.getLedger();
  const addr = ledger.user;
  const avail = ledger.availableBalance;
  const total = ledger.totalBalance;
  console.info("[zg-ledger] Ledger for", addr);
  console.info("  availableBalance:", avail.toString());
  console.info("  totalBalance:    ", total.toString());
  if (ledger.additionalInfo) {
    console.info("  additionalInfo:  ", ledger.additionalInfo);
  }
}

async function cmdDeposit(amountStr: string): Promise<void> {
  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    console.error("[zg-ledger] deposit requires a positive number, got:", amountStr);
    process.exit(1);
  }
  const broker = await createBroker();
  console.info("[zg-ledger] Depositing", amount, "0G into ledger (on-chain tx)…");
  await broker.ledger.depositFund(amount);
  console.info("[zg-ledger] depositFund submitted/completed. Run `status` to verify.");
}

async function main(): Promise<void> {
  const [, , sub, arg] = process.argv;
  if (!sub || sub === "-h" || sub === "--help") {
    usage();
    process.exit(sub ? 0 : 1);
  }
  try {
    if (sub === "status") {
      await cmdStatus();
      return;
    }
    if (sub === "deposit") {
      if (!arg) {
        console.error("[zg-ledger] deposit requires an amount.");
        usage();
        process.exit(1);
      }
      await cmdDeposit(arg);
      return;
    }
    console.error("[zg-ledger] Unknown command:", sub);
    usage();
    process.exit(1);
  } catch (e) {
    console.error("[zg-ledger] Error:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
}

void main();
