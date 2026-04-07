"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreatorStudioStub } from "@/views/CreatorStudioStub";

export default function CreatorDeFiPoolsPage() {
  return (
    <CreatorStudioStub
      title="DeFi pools"
      description="Creator token / BTC-pegged liquidity: TVL, fee APR, and LP staking farms for your symbol."
    >
      <p className="mb-4">Deploy pool links via CreatorEconomyRegistry and surface Aerodrome / Uniswap v3 positions.</p>
      <Button asChild variant="secondary" className="rounded-xl">
        <Link href="/defi">Open DeFi hub</Link>
      </Button>
    </CreatorStudioStub>
  );
}
