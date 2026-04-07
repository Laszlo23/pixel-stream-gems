"use client";

import Link from "next/link";
import {
  EXPERIENCE_TIER_DESCRIPTION,
  EXPERIENCE_TIER_LABEL,
  type CreatorDigitalListing,
  type CreatorFanShop,
  type CreatorRedeemableListing,
} from "@/data/creatorFanMarketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { AlertTriangle, Film, Gift, ListOrdered, ShieldCheck, Sparkles } from "lucide-react";

function MarketplacePolicy() {
  return (
    <Card className="rounded-2xl border-amber-500/25 bg-amber-500/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          How fan vouchers work
        </CardTitle>
        <CardDescription className="text-xs leading-relaxed">
          Digital items unlock files or access in-app. <span className="text-foreground/90">Redeemable collectables</span> mean you
          and the creator schedule something private after you claim — always between consenting adults and subject to{" "}
          <strong className="font-medium text-foreground">local law</strong>. Gems shows listings, sign-in proof, and a
          structured redemption thread; it does <strong className="font-medium text-foreground">not</strong> broker,
          guarantee, or supervise off-platform time.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 text-xs text-muted-foreground flex gap-2 items-start">
        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600/80" />
        <p>
          Creators set their own boundaries in each listing. If anything feels unclear, ask in redemption before you
          release a collectable. Disputes follow the creator&apos;s posted policy plus platform rules.
        </p>
      </CardContent>
    </Card>
  );
}

function DigitalCard({ item, creatorName }: { item: CreatorDigitalListing; creatorName: string }) {
  return (
    <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Badge variant="secondary" className="rounded-md text-[10px] mb-2 font-normal">
              Digital collectable
            </Badge>
            <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
            {item.subtitle && <CardDescription className="text-xs mt-1">{item.subtitle}</CardDescription>}
          </div>
          <span className="text-sm font-mono font-semibold text-primary shrink-0">{item.priceLabel}</span>
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex-1 space-y-2">
        <p className="leading-relaxed">{item.description}</p>
        <p className="text-xs text-foreground/80">
          <span className="text-muted-foreground">You get:</span> {item.deliverable}
        </p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full rounded-xl" variant="secondary" disabled title="Release flow wiring next">
          Sign in to release
        </Button>
        <p className="text-[10px] text-muted-foreground text-center w-full mt-2">
          Demo — settlement on {creatorName}&apos;s shelf via collectables market.
        </p>
      </CardFooter>
    </Card>
  );
}

function RedeemableCard({ item }: { item: CreatorRedeemableListing }) {
  const tierLabel = EXPERIENCE_TIER_LABEL[item.tier];
  const tierExplainer = EXPERIENCE_TIER_DESCRIPTION[item.tier];

  return (
    <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm flex flex-col h-full border-primary/15">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <Badge className="rounded-md text-[10px] gap-1">
            <Gift className="w-3 h-3" />
            Fan voucher
          </Badge>
          <Badge variant="outline" className="rounded-md text-[10px] font-medium border-primary/40">
            {tierLabel}
          </Badge>
        </div>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{item.title}</CardTitle>
          <span className="text-sm font-mono font-semibold text-primary shrink-0">{item.priceLabel}</span>
        </div>
        <CardDescription className="text-xs mt-2 leading-relaxed">{tierExplainer}</CardDescription>
        <p className="text-xs font-medium text-foreground mt-2">Time box: {item.durationLabel}</p>
      </CardHeader>
      <CardContent className="text-sm space-y-4 flex-1">
        <div>
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            What this tier usually covers
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-muted-foreground text-xs leading-relaxed">
            {item.included.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <Separator />
        <div>
          <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-primary" />
            Redemption flow
          </p>
          <ol className="list-decimal pl-4 space-y-1.5 text-muted-foreground text-xs leading-relaxed">
            {item.redemptionSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
        {item.notesForBuyer && (
          <p className="text-[11px] text-muted-foreground border border-border/60 rounded-lg p-3 bg-muted/30 leading-relaxed">
            <span className="font-medium text-foreground">Creator note:</span> {item.notesForBuyer}
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex-col gap-2">
        <Button className="w-full rounded-xl" disabled title="Release + redemption inbox next">
          Sign in to release
        </Button>
        <p className="text-[10px] text-muted-foreground text-center">
          After release, &quot;Redeem&quot; opens a thread with date proposals and policy checkboxes.
        </p>
      </CardFooter>
    </Card>
  );
}

export function CreatorFanMarketplaceSection({
  shop,
  creatorName,
  className,
}: {
  shop: CreatorFanShop;
  creatorName: string;
  className?: string;
}) {
  const hasDigital = shop.digital.length > 0;
  const hasRedeemable = shop.redeemable.length > 0;

  if (!hasDigital && !hasRedeemable) return null;

  const defaultTab = hasDigital ? "digital" : "redeemable";

  return (
    <section id="fan-collectables" className={cn("scroll-mt-24", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Film className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-semibold text-foreground tracking-tight">Fan collectables</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl leading-relaxed">{shop.headline}</p>

      <div className="space-y-6">
        <MarketplacePolicy />

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList
            className={cn(
              "grid w-full max-w-md rounded-xl bg-muted/50 p-1 h-auto",
              hasDigital && hasRedeemable ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {hasDigital && (
              <TabsTrigger value="digital" className="rounded-lg text-xs sm:text-sm py-2">
                Recordings & digital
              </TabsTrigger>
            )}
            {hasRedeemable && (
              <TabsTrigger value="redeemable" className="rounded-lg text-xs sm:text-sm py-2">
                Redeemable experiences
              </TabsTrigger>
            )}
          </TabsList>

          {hasDigital && (
            <TabsContent value="digital" className="mt-6">
              <p className="text-xs text-muted-foreground mb-4">
                Own the file or access pass — resell on the{" "}
                <Link href="/marketplace" className="text-primary underline-offset-4 hover:underline">
                  collectables market
                </Link>
                .
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {shop.digital.map((item) => (
                  <DigitalCard key={item.id} item={item} creatorName={creatorName} />
                ))}
              </div>
            </TabsContent>
          )}

          {hasRedeemable && (
            <TabsContent value="redeemable" className="mt-6 space-y-4">
              <div className="rounded-xl border border-border/80 bg-card/40 p-4 text-xs text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-1">Choosing a tier</p>
                <p>
                  <strong className="text-foreground">Dinner or social</strong> is the lightest IRL box — think a meal or
                  equivalent outing. <strong className="text-foreground">Extended evening</strong> adds more hours in the
                  same day. <strong className="text-foreground">VIP extended</strong> is the longest window; exact rules
                  always come from the creator&apos;s private brief after you claim.
                </p>
              </div>
              <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                {shop.redeemable.map((item) => (
                  <RedeemableCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}
