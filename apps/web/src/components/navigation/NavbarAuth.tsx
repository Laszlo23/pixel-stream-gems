"use client";

import Link from "next/link";
import { useAccount } from "wagmi";
import { useAppActiveWallet, useAppPrivy } from "@/hooks/usePrivyCompat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { privyDisplayName } from "@/lib/privyDisplayName";
import { LogOut, UserRound } from "lucide-react";

/** Sign in via Privy (email, Google, Apple, external wallet); profile chip when authenticated. */
export function NavbarAuth() {
  const { login, logout, authenticated, ready, user } = useAppPrivy();
  const { connect } = useAppActiveWallet();
  const { address, isConnected } = useAccount();

  if (!ready) {
    return (
      <Button size="sm" variant="secondary" className="rounded-xl h-9 min-w-[88px] invisible" disabled aria-hidden>
        Join free
      </Button>
    );
  }

  if (!authenticated) {
    return (
      <Button
        size="sm"
        className={cn(
          "rounded-xl h-9 px-4 font-semibold border border-white/10 text-white",
          "shadow-lux hover:shadow-lux-lg hover:-translate-y-0.5 transition-all duration-300",
        )}
        style={{ background: "var(--lux-gradient-cta)" }}
        onClick={() => login()}
        aria-label="Create account or sign in"
      >
        Join free
      </Button>
    );
  }

  if (!isConnected || !address) {
    return (
      <Button
        size="sm"
        variant="secondary"
        className="rounded-xl h-9 px-3"
        type="button"
        onClick={() => void connect()}
      >
        Connect wallet
      </Button>
    );
  }

  const label = privyDisplayName(user, address);

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Link
        href="/profile"
        className={cn(
          "flex items-center gap-2 rounded-xl pl-1 pr-3 py-1 h-9 max-w-[200px]",
          "border border-[rgba(255,43,85,0.2)] bg-[#111111]/80 backdrop-blur-md",
          "hover:border-[rgba(255,43,85,0.45)] hover:shadow-lux",
          "transition-all duration-300 hover:-translate-y-0.5",
        )}
      >
        <span className="relative h-7 w-7 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 ring-1 ring-[rgba(255,43,85,0.35)]">
          <UserRound className="w-4 h-4 text-muted-foreground" />
        </span>
        <span className="hidden sm:inline text-sm font-medium truncate text-foreground">{label}</span>
      </Link>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
        onClick={() => void logout()}
        aria-label="Log out"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
}
