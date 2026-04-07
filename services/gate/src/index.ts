import Fastify from "fastify";
import { SignJWT } from "jose";
import { createPublicClient, http, type Address, erc20Abi } from "viem";
import { baseSepolia } from "viem/chains";

const PORT = Number(process.env.PORT ?? 8787);
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-jwt-secret-change-me");
const RPC_URL = process.env.RPC_URL ?? "https://sepolia.base.org";
const GATE_TOKEN = (process.env.GATE_TOKEN_ADDRESS ?? "0x0000000000000000000000000000000000000000") as Address;
const MIN_BALANCE = BigInt(process.env.GATE_MIN_TOKEN_BALANCE ?? "0");
const SUPERFLUID_SUBGRAPH = process.env.SUPERFLUID_SUBGRAPH_URL ?? "";
const FLOW_RECEIVER = (process.env.FLOW_CHECK_RECEIVER ?? "") as `0x${string}` | "";
const FLOW_TOKEN = (process.env.FLOW_CHECK_TOKEN ?? "") as `0x${string}` | "";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(RPC_URL),
});

async function hasMinTokenBalance(wallet: Address): Promise<boolean> {
  if (GATE_TOKEN === "0x0000000000000000000000000000000000000000" || MIN_BALANCE === 0n) return true;
  const bal = await publicClient.readContract({
    address: GATE_TOKEN,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [wallet],
  });
  return bal >= MIN_BALANCE;
}

async function hasActiveFlow(wallet: Address): Promise<boolean> {
  if (!SUPERFLUID_SUBGRAPH || FLOW_RECEIVER === "" || FLOW_TOKEN === "") return true;
  const query = `query($s:String!,$r:String!,$t:String!){
    streams(where:{sender:$s, receiver:$r, token:$t, currentFlowRate_not:"0"}) { id }
  }`;
  const res = await fetch(SUPERFLUID_SUBGRAPH, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      variables: {
        s: wallet.toLowerCase(),
        r: FLOW_RECEIVER.toLowerCase(),
        t: FLOW_TOKEN.toLowerCase(),
      },
    }),
  });
  const json = (await res.json()) as { data?: { streams?: unknown[] } };
  return (json.data?.streams?.length ?? 0) > 0;
}

async function admit(wallet: Address): Promise<{ ok: boolean; reason?: string }> {
  const balOk = await hasMinTokenBalance(wallet);
  if (!balOk) return { ok: false, reason: "insufficient_token_balance" };
  const flowOk = await hasActiveFlow(wallet);
  if (!flowOk) return { ok: false, reason: "no_active_superfluid_stream" };
  return { ok: true };
}

const app = Fastify({ logger: true });

app.post("/v1/room-token", async (req, reply) => {
  const body = req.body as { roomId?: string; address?: string };
  const roomId = body.roomId ?? "";
  const address = body.address as Address | undefined;
  if (!roomId || !address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return reply.code(400).send({ error: "roomId and address required" });
  }
  const { ok, reason } = await admit(address);
  if (!ok) return reply.code(403).send({ error: reason ?? "denied" });

  const token = await new SignJWT({ room: roomId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(address)
    .setExpirationTime("15m")
    .sign(JWT_SECRET);

  return { token };
});

app.get("/health", async () => ({ ok: true }));

app.listen({ port: PORT, host: "0.0.0.0" });
