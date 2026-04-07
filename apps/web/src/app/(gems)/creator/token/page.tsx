"use client";

import { CreatorStudioStub } from "@/views/CreatorStudioStub";
import { contractAddresses } from "@/lib/contracts";

export default function CreatorTokenPage() {
  const factory = contractAddresses.creatorTokenFactory;
  return (
    <CreatorStudioStub
      title="Creator token"
      description="Deploy $YOURSYMBOL via CreatorTokenFactory. Pair with cbBTC / wBTC / tBTC on an AMM on Base."
    >
      <p>
        Factory address:{" "}
        <span className="font-mono text-xs text-foreground">{factory ?? "set NEXT_PUBLIC_CREATOR_TOKEN_FACTORY_ADDRESS"}</span>
      </p>
    </CreatorStudioStub>
  );
}
