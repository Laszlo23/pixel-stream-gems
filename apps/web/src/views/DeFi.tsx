"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contractAddresses } from "@/lib/contracts";
import { Bitcoin, Layers } from "lucide-react";

const DeFi = () => {
  const lp = contractAddresses.lpStakingRewards;
  const nftFarm = contractAddresses.nftStakingRewards;
  const registry = contractAddresses.creatorEconomyRegistry;

  return (
    <div className="min-h-full bg-background">
      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-24 lg:pb-16 max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            DeFi hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            LP staking rewards and NFT staking farms. Pair creator tokens with cbBTC / wBTC / tBTC on Base AMMs, then stake LP
            here.
          </p>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bitcoin className="w-4 h-4 text-primary" />
              Contracts
            </CardTitle>
            <CardDescription className="text-xs">One pool per asset; deploy via Foundry and set env vars.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs font-mono break-all text-foreground">
            <div>
              <span className="text-muted-foreground block mb-1">LPStakingRewards</span>
              {lp ?? "NEXT_PUBLIC_LP_STAKING_REWARDS_ADDRESS"}
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">NFTStakingRewards</span>
              {nftFarm ?? "NEXT_PUBLIC_NFT_STAKING_REWARDS_ADDRESS"}
            </div>
            <div>
              <span className="text-muted-foreground block mb-1">CreatorEconomyRegistry</span>
              {registry ?? "NEXT_PUBLIC_CREATOR_ECONOMY_REGISTRY_ADDRESS"}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DeFi;
