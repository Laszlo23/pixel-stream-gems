"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CreatorStudioStub({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="container mx-auto px-4 py-8 pb-16 max-w-3xl space-y-6">
      <div>
        <Link href="/creator" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <Card className="rounded-2xl border-border/80 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Implementation note</CardTitle>
          <CardDescription className="text-xs">
            Wire this screen to your API, indexer, and on-chain factories. Smart contracts for NFT collections, marketplace,
            and staking live in <code className="text-[11px]">packages/contracts</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
      </Card>
    </main>
  );
}
