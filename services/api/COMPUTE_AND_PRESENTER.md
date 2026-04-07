# Presenter chat and compute jobs

## Presenter replies (`POST /v1/rooms/:roomId/presenter-reply`)

Hybrid responses for demo / presentation rooms:

1. **Phrase bank** — `chat_phrases` in Postgres (seeded by `sql/seed_chat_phrases.sql` when you run `npm run db:migrate -w api`). If the DB is down or empty, the API falls back to in-memory phrases in `src/fallbackPhrases.ts`.
2. **LLM** — When the client sends a non-empty `userMessage` (and `idle` is not true), the server adds one short reply using either **0G Compute** or **xAI Grok**, depending on configuration (see below). API keys and 0G wallet keys stay **server-only**.

Request body (JSON):

- `userMessage` (optional) — viewer text; drives the LLM branch when not idle.
- `idle` (optional) — if true, only canned phrases (saves tokens for background chit-chat).
- `personaName`, `streamCategory` (optional) — passed into the system prompt.
- `siweMessage`, `siweSignature` (optional) — required when `PRESENTER_REQUIRE_ASM_PURCHASE=1`; valid SIWE proving the wallet that purchased `AgentSkillMarket` skills.

Response: `{ "lines": string[] }` (each line already passed through a light local filter in `src/moderate.ts`).

### LLM backends

| Env | Behavior |
|-----|----------|
| `PRESENTER_LLM=auto` (default) | Use 0G if `ZG_RPC_URL` + `ZG_WALLET_PRIVATE_KEY` are set; else xAI if `XAI_API_KEY` is set; else canned only. |
| `PRESENTER_LLM=zerog` | 0G only (`src/zerogInference.ts`). |
| `PRESENTER_LLM=xai` | xAI only (`XAI_API_KEY`, `XAI_MODEL`). |

0G variables (see also root [.env.example](../../.env.example)):

- `ZG_RPC_URL` — e.g. `https://evmrpc-testnet.0g.ai` (Galileo testnet).
- `ZG_WALLET_PRIVATE_KEY` — hot wallet on that chain; fund native 0G on Galileo, then **deposit into the compute ledger** (not automatic).
- `ZG_DEFAULT_PROVIDER_ADDRESS` — optional; if unset, the first on-chain `chatbot` service is used.

Implementation: `@0glabs/0g-serving-broker` + `ethers` v6 in `services/api`.

#### 0G ledger CLI (local only — keys stay in `.env`)

From the **repo root**, with `ZG_RPC_URL` and `ZG_WALLET_PRIVATE_KEY` set in root `.env` (the script loads `../../.env` from `services/api/scripts`):

```bash
npm run zg:ledger -w api -- status
npm run zg:ledger -w api -- deposit 0.05
```

`deposit <amount>` calls the SDK `ledger.depositFund(amount)` (amount in **0G** units per broker typings). Requires native 0G on the wallet for gas + deposit. Never commit real keys; never paste them into chat.

After deposit, run `npm run dev:api` (or your process manager) and test:

```bash
curl -sS -X POST "http://127.0.0.1:8788/v1/rooms/demo/presenter-reply" \
  -H "Content-Type: application/json" \
  -d '{"userMessage":"hello"}' | jq .
```

### Optional: AgentSkillMarket quota

When `PRESENTER_REQUIRE_ASM_PURCHASE=1`, every presenter request must include valid `siweMessage` / `siweSignature`, and `AgentSkillMarket.purchases(wallet, agentId, skillId)` must be &gt; 0.

Server env:

- `AGENT_SKILL_MARKET_ADDRESS` — deployed contract on Base (or Sepolia).
- `AGENT_SKILL_MARKET_AGENT_ID`, `AGENT_SKILL_MARKET_SKILL_ID` — decimal strings.
- `BASE_SEPOLIA_RPC_URL` or `RPC_URL` — for `eth_call` reads.

HTTP errors: `401` (SIWE), `402` (no purchase), `503` (misconfiguration / RPC).

## Compute jobs (`POST /v1/jobs/enqueue`)

Queues a row in `compute_jobs` for a **worker** you run separately (VPS, CI, or **0G** compute for images). This repo does not run the worker.

Body:

```json
{ "roomId": "maya", "kind": "poster", "prompt": "optional brief for the render pipeline" }
```

`kind` is `poster` or `loop`. Requires `DATABASE_URL` and a migrated schema.

### 0G (Zero Gravity) direction

[0G](https://www.0g.ai/) provides decentralized GPU inference, storage, and settlement. This repo now wires **presenter chat** to 0G via `src/zerogInference.ts`. For **render jobs**, keep the HTTP contract stable (`enqueue` + worker polling `compute_jobs`), then extend the worker to call 0G image endpoints (same broker pattern as chat) and set `result_url`. `enqueueRenderJob` in `src/jobs.ts` remains the extension point.
