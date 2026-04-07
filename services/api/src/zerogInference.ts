import { createRequire } from "node:module";
import { JsonRpcProvider, Wallet } from "ethers";
import type { ZGComputeNetworkBroker } from "@0glabs/0g-serving-broker";

// Load CJS build: Node's ESM `import` resolves to lib.esm, which breaks under Node 22 (bad re-exports).
const require0g = createRequire(import.meta.url);
const { createZGComputeNetworkBroker } = require0g("@0glabs/0g-serving-broker") as {
  createZGComputeNetworkBroker: typeof import("@0glabs/0g-serving-broker").createZGComputeNetworkBroker;
};

let brokerPromise: Promise<ZGComputeNetworkBroker> | null = null;

function normalizePrivateKey(raw: string): string {
  const s = raw.trim();
  return s.startsWith("0x") ? s : `0x${s}`;
}

export function isZeroGInferenceConfigured(): boolean {
  return Boolean(process.env.ZG_RPC_URL?.trim() && process.env.ZG_WALLET_PRIVATE_KEY?.trim());
}

async function getBroker(): Promise<ZGComputeNetworkBroker> {
  if (!brokerPromise) {
    const rpc = process.env.ZG_RPC_URL?.trim();
    const pk = process.env.ZG_WALLET_PRIVATE_KEY?.trim();
    if (!rpc || !pk) {
      throw new Error("zerog_not_configured");
    }
    const provider = new JsonRpcProvider(rpc);
    const wallet = new Wallet(normalizePrivateKey(pk), provider);
    // 0g-serving-broker's typings resolve ethers from CJS; this app uses ESM ethers — structurally compatible at runtime.
    brokerPromise = createZGComputeNetworkBroker(wallet as never);
  }
  return brokerPromise;
}

/** Reset broker (e.g. after env reload in tests). */
export function resetZeroGBrokerForTests(): void {
  brokerPromise = null;
}

async function resolveProviderAddress(broker: ZGComputeNetworkBroker): Promise<string> {
  const fromEnv = process.env.ZG_DEFAULT_PROVIDER_ADDRESS?.trim();
  if (fromEnv && /^0x[a-fA-F0-9]{40}$/.test(fromEnv)) {
    return fromEnv;
  }
  const services = await broker.inference.listService(0, 50, false);
  const chatbot = services.find((s) => String(s.serviceType).toLowerCase() === "chatbot");
  if (chatbot?.provider) {
    return chatbot.provider;
  }
  throw new Error("zerog_no_chatbot_provider");
}

function chatCompletionsUrl(serviceEndpoint: string): string {
  const base = serviceEndpoint.replace(/\/$/, "");
  if (/\/chat\/completions$/i.test(base)) return base;
  if (/\/v1$/i.test(base)) return `${base}/chat/completions`;
  return `${base}/chat/completions`;
}

async function ensureProviderReady(broker: ZGComputeNetworkBroker, providerAddress: string): Promise<void> {
  try {
    const status = await broker.inference.checkProviderSignerStatus(providerAddress);
    if (!status.isAcknowledged) {
      console.warn("[zerog] provider TEE signer not acknowledged on-chain; requests may fail", providerAddress);
    }
  } catch (e) {
    console.warn("[zerog] checkProviderSignerStatus failed", e instanceof Error ? e.message : e);
  }
  try {
    const ok = await broker.inference.acknowledged(providerAddress);
    if (!ok) {
      await broker.inference.acknowledgeProviderSigner(providerAddress);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (!/acknowledge|already|known/i.test(msg)) {
      console.warn("[zerog] acknowledgeProviderSigner", msg);
    }
  }
}

function mergeRequestHeaders(auth: unknown): Record<string, string> {
  const base: Record<string, string> = { "Content-Type": "application/json" };
  if (!auth || typeof auth !== "object") return base;
  for (const [k, v] of Object.entries(auth as Record<string, unknown>)) {
    if (v !== undefined && v !== null && String(v) !== "") {
      base[k] = String(v);
    }
  }
  return base;
}

export async function zerogChatCompletion(params: {
  system: string;
  user: string;
}): Promise<string | null> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 45_000);
  try {
    const broker = await getBroker();
    const providerAddress = await resolveProviderAddress(broker);
    await ensureProviderReady(broker, providerAddress);

    const { endpoint, model } = await broker.inference.getServiceMetadata(providerAddress);
    const billingContent = params.user.slice(0, 2000);
    const authHeaders = await broker.inference.getRequestHeaders(providerAddress, billingContent);
    const headers = mergeRequestHeaders(authHeaders);

    const url = chatCompletionsUrl(endpoint);
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        max_tokens: 120,
        temperature: 0.75,
        messages: [
          { role: "system", content: params.system },
          { role: "user", content: params.user },
        ],
      }),
      signal: controller.signal,
    });

    const rawText = await res.text();
    if (!res.ok) {
      console.warn("[zerog] non-OK", res.status, rawText.slice(0, 500));
      return null;
    }

    let data: {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: unknown;
      id?: string;
    };
    try {
      data = JSON.parse(rawText) as typeof data;
    } catch {
      console.warn("[zerog] invalid JSON body");
      return null;
    }

    const zgKey =
      res.headers.get("ZG-Res-Key") ??
      res.headers.get("zg-res-key") ??
      res.headers.get("Zg-Res-Key") ??
      undefined;
    const chatId = zgKey || data.id;
    const usageStr = data.usage !== undefined ? JSON.stringify(data.usage) : "";

    try {
      await broker.inference.processResponse(providerAddress, chatId, usageStr);
    } catch (e) {
      console.warn("[zerog] processResponse failed", e instanceof Error ? e.message : e);
    }

    const content = data.choices?.[0]?.message?.content?.trim();
    return content ?? null;
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      console.warn("[zerog] request aborted (timeout)");
    } else {
      console.warn("[zerog] request failed", e instanceof Error ? e.message : e);
    }
    return null;
  } finally {
    clearTimeout(t);
  }
}
