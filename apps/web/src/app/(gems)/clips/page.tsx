"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film } from "lucide-react";

export default function ClipsPage() {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Film className="w-7 h-7 text-[hsl(var(--neon-blue))]" />
          Clips
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Short viral moments from livestreams — shareable loops.</p>
      </div>
      <Card className="glass-panel">
        <CardHeader>
          <CardTitle className="text-base">Your clips</CardTitle>
          <CardDescription>Clip editor + on-chain attribution hooks (Phase 2).</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild className="rounded-xl">
            <Link href="/discover">Discover streams</Link>
          </Button>
          <Button asChild variant="secondary" className="rounded-xl">
            <Link href="/live/maya">Watch live</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
