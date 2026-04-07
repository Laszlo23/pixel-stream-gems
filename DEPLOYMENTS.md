# Deployments and on-chain attribution

Use this file as the **public record** that ties this repository to deployed contracts and (optionally) 0G Galileo activity. Replace placeholders after each deploy. **Never** paste private keys here—only addresses and transaction hashes.

## Team / repository identity

| Field | Value |
|--------|--------|
| Project | Gems (pixel-stream-gems) |
| Source repository | _e.g. `https://github.com/your-org/pixel-stream-gems`_ |
| Legal entity or maintainer (optional) | _Grant applicant or company name_ |

---

## Base Sepolia (chain ID `84532`)

Fund the deployer with [Base Sepolia ETH](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet) before broadcasting.

**Deploy commands** (from repo root, with root `.env` filled):

```bash
npm run forge:deploy:sepolia              # broadcast only
npm run forge:deploy:sepolia:verify       # broadcast + Basescan verify (needs BASESCAN_API_KEY)
npm run forge:deploy:agent-market         # optional AgentSkillMarket
npm run forge:deploy:agent-market:verify
```

**Explorer:** [Base Sepolia on Basescan](https://sepolia.basescan.org)

### Core protocol (`Deploy.s.sol`)

| Contract | Address | Deployment tx | Verified |
|----------|---------|-----------------|----------|
| `CreatorTokenFactory` | `0x…` | `0x…` | yes / no |
| `CreatorNFTFactory` | `0x…` | `0x…` | yes / no |
| `GemsMarketplace` | `0x…` | `0x…` | yes / no |
| `CreatorEconomyRegistry` | `0x…` | `0x…` | yes / no |
| `GemsPlatformToken` (if `DEPLOY_PLATFORM_TOKEN=1`) | `0x…` | `0x…` | yes / no |
| `FeeVault` (if `FEE_ASSET` set) | `0x…` | `0x…` | yes / no |

### Optional: `AgentSkillMarket` (`DeployAgentSkillMarket.s.sol`)

| Contract | Address | Deployment tx | Verified |
|----------|---------|-----------------|----------|
| `AgentSkillMarket` | `0x…` | `0x…` | yes / no |

### Frontend environment mapping

Set these in your hosting provider (or local `.env`) to match the table above. Names align with [`.env.example`](.env.example):

- `NEXT_PUBLIC_CREATOR_TOKEN_FACTORY_ADDRESS`
- `NEXT_PUBLIC_CREATOR_NFT_FACTORY_ADDRESS`
- `NEXT_PUBLIC_GEMS_MARKETPLACE_ADDRESS`
- `NEXT_PUBLIC_GEMS_PLATFORM_TOKEN_ADDRESS` (if deployed)
- `NEXT_PUBLIC_CREATOR_ECONOMY_REGISTRY_ADDRESS`
- `NEXT_PUBLIC_FEE_VAULT_ADDRESS` (if deployed)
- `NEXT_PUBLIC_AGENT_SKILL_MARKET_ADDRESS` (if deployed)

---

## 0G (Galileo testnet) — operational proof

This app uses **0G Compute** for presenter LLM routing (see [`services/api/COMPUTE_AND_PRESENTER.md`](services/api/COMPUTE_AND_PRESENTER.md)). There is **no** Gems protocol Solidity deploy on 0G in this repo; “proof” is a **declared public wallet** plus **on-chain activity** you can link.

| Item | Value |
|------|--------|
| Network | 0G Galileo testnet (RPC e.g. `https://evmrpc-testnet.0g.ai`) |
| **Public** server wallet address (`ZG_WALLET_PRIVATE_KEY` controls this—never commit the key) | `0x…` |
| `ledger.depositFund` tx hash (after [`services/api/scripts/zg-ledger.ts`](services/api/scripts/zg-ledger.ts) or equivalent) | `0x…` |
| Block explorer link for that tx | _Use [0G docs](https://docs.0g.ai/) / official explorer when available_ |

Optional: enable Galileo in the web app with `NEXT_PUBLIC_0G_CHAIN_ENABLED=1` and `NEXT_PUBLIC_ZG_RPC_URL` per [`.env.example`](.env.example).

---

## Base mainnet (production)

Do **not** deploy to mainnet until you have completed security review and operational runbooks. When you do, add a **Base mainnet** section here (chain ID `8453`, [basescan.org](https://basescan.org)) with the same table shape and a separate deploy command using a dedicated RPC and multisig where possible.
