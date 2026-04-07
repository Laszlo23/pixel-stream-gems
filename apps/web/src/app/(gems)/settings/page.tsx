"use client";

import Link from "next/link";
import { useAppPrivy } from "@/hooks/usePrivyCompat";
import { useAccount, useChainId } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Wallet, Link2 } from "lucide-react";
import { privyDisplayName } from "@/lib/privyDisplayName";

export default function SettingsPage() {
  const { login, logout, linkWallet, authenticated, ready, user } = useAppPrivy();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Settings className="w-7 h-7 text-muted-foreground" />
        Settings
      </h1>

      <Card id="account" className="glass-panel border-border/60 scroll-mt-24">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[hsl(var(--accent-glow))]" />
            Account &amp; wallet
          </CardTitle>
          <CardDescription>
            Sign in with email, Google, or Apple — Gems creates an embedded wallet when needed. You can also link an
            external wallet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!ready ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !authenticated || !isConnected ? (
            <Button className="rounded-xl" onClick={() => login()}>
              Sign in or create account
            </Button>
          ) : (
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Signed in as </span>
                <span className="font-medium text-foreground">{privyDisplayName(user, address)}</span>
              </p>
              <p className="font-mono text-xs break-all text-muted-foreground">{address}</p>
              <p className="text-xs text-muted-foreground">Chain ID: {chainId}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5" onClick={() => linkWallet()}>
                  <Link2 className="w-3.5 h-3.5" />
                  Link wallet
                </Button>
                <Button variant="secondary" size="sm" className="rounded-xl" onClick={() => void logout()}>
                  Log out
                </Button>
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Configure login methods and domains in the{" "}
            <a href="https://dashboard.privy.io" className="text-[hsl(var(--accent-glow))] hover:underline">
              Privy dashboard
            </a>
            . Need help? Visit{" "}
            <Link href="/safety" className="text-[hsl(var(--accent-glow))] hover:underline">
              Safety &amp; trust
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <Card className="glass-panel border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
          <CardDescription>Notifications, content filters, and privacy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">More toggles ship with your account API.</p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/safety">Safety &amp; trust</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
