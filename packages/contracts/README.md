# Gems protocol (Foundry)

Solidity for **Base** / **Base Sepolia**: creator ERC-20s, per-creator NFT collections (max 3 wallets), marketplace, optional platform token, LP + NFT staking rewards, fee vault, and an optional creator registry.

## Contracts

| Contract | Role |
|----------|------|
| `CreatorToken` | Per-creator ERC-20; owner mints |
| `CreatorTokenFactory` | `deployCreatorToken(name, symbol, initialSupply)` |
| `FeeVault` | Pull-based ERC-20 fee split (platform / creator bps) |
| `CreatorNFTCollection` | ERC-721 + ERC-2981; public or free mint; kind `0..2` (Access / Moments / Perks) |
| `CreatorNFTFactory` | Up to **3** collections per caller |
| `GemsMarketplace` | ETH listings for ERC-721; pays 2981 royalty then platform fee |
| `GemsPlatformToken` | Capped ERC-20 + permit (optional rewards/governance) |
| `CreatorEconomyRegistry` | Creator sets token, 3 NFT slots, optional LP pool pointer |
| `LPStakingRewards` | Stake ERC-20 (e.g. LP), earn reward token (Synthetix-style schedule) |
| `NFTStakingRewards` | Stake NFTs from one collection, earn ERC-20 rewards |
| `AgentSkillMarket` | ETH `buySkill(agentId, skillId)`; platform fee bps then payout to agent; on-chain purchase counts for off-chain credits |

**Superfluid** streaming is integrated in the Next app (`LiveSupportMeter`), not duplicated on-chain here.

Deploy only the agent market:

```bash
forge script script/DeployAgentSkillMarket.s.sol:DeployAgentSkillMarket --rpc-url base_sepolia --broadcast
# Add --verify after setting BASESCAN_API_KEY in .env (see foundry.toml [etherscan])
```

## Commands

```bash
forge build
forge test
```

Deploy (see `script/Deploy.s.sol`):

```bash
forge script script/Deploy.s.sol:Deploy --rpc-url base_sepolia --broadcast
# Add --verify for Basescan (Base Sepolia)
```

From the **monorepo root**, use `npm run forge:deploy:sepolia`, `npm run forge:deploy:sepolia:verify`, etc. Record deployed addresses in **[DEPLOYMENTS.md](../../DEPLOYMENTS.md)**.

## ABIs for `apps/web`

After `forge build`, copy artifacts:

```bash
cp out/CreatorNFTFactory.sol/CreatorNFTFactory.json ../../apps/web/src/lib/abis/
# …repeat for other contracts you use in the UI
```

OpenZeppelin is resolved from the monorepo root `node_modules` (see `remappings.txt` + `foundry.toml` `libs`).
