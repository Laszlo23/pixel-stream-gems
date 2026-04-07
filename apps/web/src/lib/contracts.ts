import type { Address } from "viem";
import CreatorTokenArtifact from "@/lib/abis/CreatorToken.json";
import CreatorTokenFactoryArtifact from "@/lib/abis/CreatorTokenFactory.json";
import FeeVaultArtifact from "@/lib/abis/FeeVault.json";
import CreatorNFTFactoryArtifact from "@/lib/abis/CreatorNFTFactory.json";
import CreatorNFTCollectionArtifact from "@/lib/abis/CreatorNFTCollection.json";
import GemsMarketplaceArtifact from "@/lib/abis/GemsMarketplace.json";
import GemsPlatformTokenArtifact from "@/lib/abis/GemsPlatformToken.json";
import LPStakingRewardsArtifact from "@/lib/abis/LPStakingRewards.json";
import NFTStakingRewardsArtifact from "@/lib/abis/NFTStakingRewards.json";
import CreatorEconomyRegistryArtifact from "@/lib/abis/CreatorEconomyRegistry.json";
import AgentSkillMarketArtifact from "@/lib/abis/AgentSkillMarket.json";

export const creatorTokenAbi = CreatorTokenArtifact.abi as readonly unknown[];
export const creatorTokenFactoryAbi = CreatorTokenFactoryArtifact.abi as readonly unknown[];
export const feeVaultAbi = FeeVaultArtifact.abi as readonly unknown[];
export const creatorNftFactoryAbi = CreatorNFTFactoryArtifact.abi as readonly unknown[];
export const creatorNftCollectionAbi = CreatorNFTCollectionArtifact.abi as readonly unknown[];
export const gemsMarketplaceAbi = GemsMarketplaceArtifact.abi as readonly unknown[];
export const gemsPlatformTokenAbi = GemsPlatformTokenArtifact.abi as readonly unknown[];
export const lpStakingRewardsAbi = LPStakingRewardsArtifact.abi as readonly unknown[];
export const nftStakingRewardsAbi = NFTStakingRewardsArtifact.abi as readonly unknown[];
export const creatorEconomyRegistryAbi = CreatorEconomyRegistryArtifact.abi as readonly unknown[];
export const agentSkillMarketAbi = AgentSkillMarketArtifact.abi as readonly unknown[];

function envAddress(key: string): Address | undefined {
  const v = process.env[key];
  if (!v || !/^0x[a-fA-F0-9]{40}$/.test(v)) return undefined;
  return v as Address;
}

export const contractAddresses = {
  creatorTokenFactory: envAddress("NEXT_PUBLIC_CREATOR_TOKEN_FACTORY_ADDRESS"),
  feeVault: envAddress("NEXT_PUBLIC_FEE_VAULT_ADDRESS"),
  /** Per-room or demo creator token used for gating / display */
  demoCreatorToken: envAddress("NEXT_PUBLIC_CREATOR_TOKEN_ADDRESS"),
  creatorNftFactory: envAddress("NEXT_PUBLIC_CREATOR_NFT_FACTORY_ADDRESS"),
  gemsMarketplace: envAddress("NEXT_PUBLIC_GEMS_MARKETPLACE_ADDRESS"),
  gemsPlatformToken: envAddress("NEXT_PUBLIC_GEMS_PLATFORM_TOKEN_ADDRESS"),
  creatorEconomyRegistry: envAddress("NEXT_PUBLIC_CREATOR_ECONOMY_REGISTRY_ADDRESS"),
  /** Example farm; deploy one pool per staking asset */
  lpStakingRewards: envAddress("NEXT_PUBLIC_LP_STAKING_REWARDS_ADDRESS"),
  nftStakingRewards: envAddress("NEXT_PUBLIC_NFT_STAKING_REWARDS_ADDRESS"),
  /** ETH skill purchases; pairs with API PRESENTER_REQUIRE_ASM_PURCHASE + AGENT_SKILL_MARKET_* */
  agentSkillMarket: envAddress("NEXT_PUBLIC_AGENT_SKILL_MARKET_ADDRESS"),
} as const;
