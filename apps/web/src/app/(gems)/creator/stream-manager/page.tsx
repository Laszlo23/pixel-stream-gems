"use client";

import Link from "next/link";
import { ArrowLeft, CalendarPlus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StreamManagerPage() {
  return (
    <main className="container mx-auto px-4 py-8 pb-16 max-w-3xl space-y-6">
      <div>
        <Link href="/creator" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Stream tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Scenes, overlays, bitrate health, multi-destination restream, and chat moderation — pair with your encoder or SFU.
        </p>
      </div>

      <Card className="rounded-2xl border-primary/15 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarPlus className="w-4 h-4 text-primary" />
            Schedule &amp; listings
          </CardTitle>
          <CardDescription className="text-xs">
            Your public showtimes and visibility are managed in the creator profile studio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="rounded-xl">
            <Link href="/creator/profile#schedule">Open live schedule</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/80 bg-card/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            Technical stack
          </CardTitle>
          <CardDescription className="text-xs">
            Wire WebRTC signaling, OBS presets, and moderation shortcuts from your services layer.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Gate private rooms from the same surface once your gate service issues JWTs per stream.</p>
        </CardContent>
      </Card>
    </main>
  );
}
