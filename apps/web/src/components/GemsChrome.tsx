"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { TopNavbar } from "@/components/navigation/TopNavbar";
import { FanSidebar } from "@/components/navigation/FanSidebar";
import { MobileTabBar, MobileFanFab } from "@/components/navigation/MobileTabBar";
import { SiteFooter } from "@/components/SiteFooter";
import { EngagementOrchestrator } from "@/components/EngagementOrchestrator";
import { ReferralInviteStrip } from "@/components/engagement/ReferralInviteStrip";
import { cn } from "@/lib/utils";
import { usePrivyBypassMode } from "@/hooks/usePrivyCompat";

function PrivyBypassBanner() {
  const bypass = usePrivyBypassMode();
  if (!bypass) return null;
  return (
    <div
      role="status"
      className="border-b border-[rgba(255,43,85,0.35)] bg-[rgba(255,43,85,0.08)] px-4 py-2 text-center text-[11px] text-[hsl(var(--accent-glow))]"
    >
      Wallet-only mode — connect a browser wallet (e.g. MetaMask). Set{" "}
      <code className="rounded bg-black/40 px-1 font-mono text-foreground/90">NEXT_PUBLIC_PRIVY_APP_ID</code> for full
      Privy auth.
    </div>
  );
}

export function GemsChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isCreator = pathname.startsWith("/creator");

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      <PrivyBypassBanner />
      <EngagementOrchestrator />
      <ReferralInviteStrip />
      <TopNavbar />
      <div className="flex flex-1 pt-14 min-h-0 items-stretch">
        {!isCreator && <FanSidebar />}
        <div
          className={cn(
            "flex-1 min-w-0 min-h-[calc(100dvh-3.5rem)] flex flex-col",
            !isCreator && "pb-[calc(3.5rem+env(safe-area-inset-bottom))] lg:pb-0",
          )}
        >
          <div className="flex-1 min-h-0">{children}</div>
          {pathname !== "/" && <SiteFooter />}
        </div>
      </div>
      {!isCreator && (
        <>
          <MobileTabBar />
          <MobileFanFab />
        </>
      )}
    </div>
  );
}
