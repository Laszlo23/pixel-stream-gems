"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contractAddresses } from "@/lib/contracts";
import { getCreatorsWithFanShops } from "@/data/creatorFanMarketplace";
import { Store, Shield, Sparkles, Users, Ticket, ImageIcon, PenLine, Gift, Crown } from "lucide-react";

const collectableTypes = [
  { icon: Ticket, title: "Access Pass", desc: "Unlocks private shows." },
  { icon: ImageIcon, title: "Moment Cards", desc: "Captured moments from streams." },
  { icon: PenLine, title: "Signature Cards", desc: "Digitally signed creator cards." },
  { icon: Gift, title: "Fan Vouchers", desc: "Redeemable experiences." },
  { icon: Crown, title: "VIP Badges", desc: "Special recognition for top supporters." },
];

const Marketplace = () => {
  const market = contractAddresses.gemsMarketplace;
  const shops = getCreatorsWithFanShops();

  return (
    <div className="min-h-full bg-background lux-hero-bg">
      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-24 lg:pb-16 max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Store className="w-6 h-6 text-[hsl(var(--accent-glow))]" />
            Collectables market
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Every creator has a <span className="text-foreground font-medium">fan shelf</span> on their profile: recordings,
            passes, and redeemable experiences. The tech stays invisible — you just browse, claim, and enjoy.
          </p>
        </div>

        <Card className="rounded-2xl border-border/60 bg-[#141414]/50 backdrop-blur-md glass-panel">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Types of collectables</CardTitle>
            <CardDescription className="text-xs">Same magic, simpler names.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            {collectableTypes.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3 rounded-xl border border-border/50 bg-background/30 p-3">
                <Icon className="w-5 h-5 text-[hsl(var(--accent-glow))] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-[#141414]/50 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-[hsl(var(--accent-glow))]" />
              Creator shops
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Open a profile to browse. Creators manage inventory from Profile → Creator dashboard → Collectables.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {shops.map((s) => (
              <div
                key={s.creatorId}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border/50 bg-background/25 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground flex flex-wrap items-center gap-2">
                    @{s.creatorId}
                    {s.hasRedeemable && (
                      <Badge variant="secondary" className="rounded-md text-[10px] gap-1 font-normal">
                        <Sparkles className="w-3 h-3" />
                        Fan vouchers
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.headline}</p>
                </div>
                <Button asChild size="sm" className="rounded-xl shrink-0">
                  <Link href={`/u/${s.creatorId}#fan-collectables`}>View shelf</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-[#141414]/50 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-[hsl(var(--accent-glow))]" />
              Digital registry
            </CardTitle>
            <CardDescription className="text-xs">Configured when you deploy.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xs text-foreground break-all">
              {market ?? "NEXT_PUBLIC_GEMS_MARKETPLACE_ADDRESS"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 bg-[#141414]/40 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Global feed (next)</CardTitle>
            <CardDescription className="text-xs">
              Index listings from your collectables market contract or API.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Fans see simple “claim” and “resell” actions; authenticity IDs stay in the background for power users.
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Marketplace;
