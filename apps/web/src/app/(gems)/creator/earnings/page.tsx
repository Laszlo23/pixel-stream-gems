"use client";

import { CreatorStudioStub } from "@/views/CreatorStudioStub";

export default function CreatorEarningsPage() {
  return (
    <CreatorStudioStub
      title="Earnings"
      description="Aggregate tips, Superfluid streams, NFT primary sales, marketplace royalties, and FeeVault splits."
    >
      <p>Hook Superfluid subgraph + NFT marketplace events + FeeVault claim txs into this dashboard.</p>
    </CreatorStudioStub>
  );
}
