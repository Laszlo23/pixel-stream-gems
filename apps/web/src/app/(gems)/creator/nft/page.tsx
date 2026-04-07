"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { contractAddresses } from "@/lib/contracts";
import { EXPERIENCE_TIER_LABEL, getCreatorFanShop } from "@/data/creatorFanMarketplace";
import { Film, Gift, LayoutTemplate, Sparkles } from "lucide-react";

/** Demo studio identity — replace with connected wallet / API. */
const STUDIO_DEMO_CREATOR_ID = "maya";

export default function CreatorNFTPage() {
  const demoShop = getCreatorFanShop(STUDIO_DEMO_CREATOR_ID);

  return (
    <div className="min-h-full bg-background">
      <main className="container mx-auto px-4 pt-6 lg:pt-8 pb-24 max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-primary" />
            Collectables &amp; fan shop
          </h1>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
            Your profile&apos;s <strong className="font-medium text-foreground">fan shelf</strong> is where fans buy
            recordings and redeemable fan vouchers. Use clear tiers so buyers know if they&apos;re getting a file, a dinner
            window, or a longer VIP block.
          </p>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Digital registry · shelves</CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Up to three collectable shelves per creator via <code className="text-[10px]">CreatorNFTFactory</code> — wire
              addresses after deploy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p className="font-mono text-xs text-foreground break-all">
              Factory: {contractAddresses.creatorNftFactory ?? "NEXT_PUBLIC_CREATOR_NFT_FACTORY_ADDRESS"}
            </p>
            <p>
              List secondary sales on <code className="text-xs">GemsMarketplace</code> for EIP-2981 royalties + platform fee.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/20 bg-card/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Listing types (what fans see)
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              When you publish a listing, pick one type so the UI shows the right card and legal hints.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex gap-3">
              <Film className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Digital / recorded</p>
                <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                  Replays, stem packs, badges — deliverable is a file, link, or unlock. No IRL scheduling.
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex gap-3">
              <Gift className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Redeemable experience</p>
                <p className="text-muted-foreground text-xs leading-relaxed mt-1">
                  Map to a tier fans understand:{" "}
                  {(
                    ["meet_greet", "dinner_social", "extended_evening", "vip_extended"] as const
                  ).map((t) => (
                    <Badge key={t} variant="outline" className="mr-1 mt-1 rounded-md text-[10px] font-normal">
                      {EXPERIENCE_TIER_LABEL[t]}
                    </Badge>
                  ))}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed mt-2">
                  You write inclusion bullets and redemption steps; Gems surfaces them on your public profile. Always keep
                  scope inside applicable law — the app provides proof-of-purchase and messaging, not enforcement on-site.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {demoShop && (
          <Card className="rounded-2xl border-border/80 bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Preview (demo data · @{demoShop.creatorId})</CardTitle>
              <CardDescription className="text-xs">
                Replace with your API: {demoShop.digital.length} digital · {demoShop.redeemable.length} redeemable
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-xl">
                <Link href={`/u/${STUDIO_DEMO_CREATOR_ID}#fan-collectables`}>Open public shelf</Link>
              </Button>
              <Button size="sm" className="rounded-xl" disabled title="Editor coming with API">
                Edit listings
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
