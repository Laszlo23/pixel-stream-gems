"use client";

import { CreatorStudioStub } from "@/views/CreatorStudioStub";
import { AddZgNetworkButton } from "@/components/creator/AddZgNetworkButton";
import { AgentSkillPurchaseCard } from "@/components/creator/AgentSkillPurchaseCard";

export default function CreatorAIPage() {
  return (
    <CreatorStudioStub
      title="AI assistant"
      description="0G tokenized inference for live presenter replies, optional Base ETH credits via AgentSkillMarket, and wallet setup for Galileo testnet."
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-foreground mb-2">0G Compute (tokenized inference)</p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>
              The API calls 0G when <code className="text-[11px]">ZG_RPC_URL</code> and{" "}
              <code className="text-[11px]">ZG_WALLET_PRIVATE_KEY</code> are set (server-side only). Use{" "}
              <code className="text-[11px]">PRESENTER_LLM=zerog|xai|auto</code> to pick the backend.
            </li>
            <li>
              Fund the server wallet on Galileo, run <code className="text-[11px]">depositFund</code> via the 0G SDK, and acknowledge your chosen provider (see{" "}
              <a className="text-foreground underline-offset-2 hover:underline" href="https://docs.0g.ai/">
                0G docs
              </a>
              ).
            </li>
            <li>
              Add the testnet to your browser wallet to hold or receive test 0G:
              <span className="block mt-2">
                <AddZgNetworkButton />
              </span>
            </li>
            <li>
              Enable <code className="text-[11px]">NEXT_PUBLIC_0G_CHAIN_ENABLED=1</code> so Privy / wagmi list Galileo alongside Base (optional).
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">Base: prepaid presenter credits (optional)</p>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            If the API sets <code className="text-[11px]">PRESENTER_REQUIRE_ASM_PURCHASE=1</code>, clients must prove wallet ownership with SIWE and have bought the configured agent/skill on{" "}
            <code className="text-[11px]">AgentSkillMarket</code>.
          </p>
          <AgentSkillPurchaseCard />
        </div>

        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground border-t border-border/50 pt-4">
          <li>Stream reminders, VIP re-engagement, multi-language chat assist</li>
          <li>Log consent and regional rules for any automated messaging</li>
          <li>Suggest-only vs semi-automated modes (product choice)</li>
        </ul>
      </div>
    </CreatorStudioStub>
  );
}
