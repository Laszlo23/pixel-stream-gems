"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Radio } from "lucide-react";

export default function CreatorGoLivePage() {
  return (
    <main className="container mx-auto px-4 py-8 pb-16 max-w-3xl space-y-6">
      <div>
        <Link href="/creator" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
          ← Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Go live</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Start a public or token-gated stream. WebRTC signaling uses your configured gate + JWT when wired.
        </p>
      </div>

      <Card className="rounded-2xl border-border/80 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-primary" />
            Open broadcast room
          </CardTitle>
          <CardDescription className="text-xs">
            Use the demo room to test camera/mic as publisher, or link your own stream id once wired.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button asChild className="rounded-xl">
            <Link href="/live/maya">Open demo live room</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Plan shows
          </CardTitle>
          <CardDescription className="text-xs">
            Add titles, times, and visibility so fans know when you&apos;re on — saved in your creator profile draft.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary" className="rounded-xl">
            <Link href="/creator/profile#schedule">Manage live schedule</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
