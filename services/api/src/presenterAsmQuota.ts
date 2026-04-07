import { Contract, JsonRpcProvider } from "ethers";
import { SiweMessage } from "siwe";

const ASM_ABI = [
  "function purchases(address buyer, uint256 agentId, uint256 skillId) view returns (uint256)",
] as const;

export function isPresenterAsmQuotaRequired(): boolean {
  return process.env.PRESENTER_REQUIRE_ASM_PURCHASE === "1";
}

export type AsmQuotaBody = {
  siweMessage?: string;
  siweSignature?: string;
};

/**
 * When PRESENTER_REQUIRE_ASM_PURCHASE=1, requires a valid SIWE message/signature and
 * a non-zero AgentSkillMarket.purchases count for the configured agent/skill.
 */
export async function checkPresenterAsmAccess(body: AsmQuotaBody): Promise<
  | { ok: true; address: string }
  | { ok: false; error: "siwe_required" | "siwe_invalid" | "asm_not_configured" | "no_purchase" | "rpc_failed" }
> {
  const market = process.env.AGENT_SKILL_MARKET_ADDRESS?.trim();
  const rpc =
    process.env.BASE_SEPOLIA_RPC_URL?.trim() ||
    process.env.RPC_URL?.trim() ||
    process.env.BASE_MAINNET_RPC_URL?.trim();

  const agentRaw = process.env.AGENT_SKILL_MARKET_AGENT_ID?.trim() ?? "0";
  const skillRaw = process.env.AGENT_SKILL_MARKET_SKILL_ID?.trim() ?? "0";

  if (!market || !/^0x[a-fA-F0-9]{40}$/.test(market) || !rpc) {
    return { ok: false, error: "asm_not_configured" };
  }

  const msg = typeof body.siweMessage === "string" ? body.siweMessage.trim() : "";
  const sig = typeof body.siweSignature === "string" ? body.siweSignature.trim() : "";
  if (!msg || !sig) {
    return { ok: false, error: "siwe_required" };
  }

  let address: string;
  try {
    const siwe = new SiweMessage(msg);
    const result = await siwe.verify({ signature: sig });
    if (!result.success) {
      return { ok: false, error: "siwe_invalid" };
    }
    address = siwe.address;
  } catch {
    return { ok: false, error: "siwe_invalid" };
  }

  let agentId: bigint;
  let skillId: bigint;
  try {
    agentId = BigInt(agentRaw);
    skillId = BigInt(skillRaw);
  } catch {
    return { ok: false, error: "asm_not_configured" };
  }


  try {
    const provider = new JsonRpcProvider(rpc);
    const c = new Contract(market, ASM_ABI, provider);
    const count = (await c.purchases(address, agentId, skillId)) as bigint;
    if (count <= 0n) {
      return { ok: false, error: "no_purchase" };
    }
    return { ok: true, address };
  } catch (e) {
    console.warn("[presenter-asm] purchases read failed", e instanceof Error ? e.message : e);
    return { ok: false, error: "rpc_failed" };
  }
}
