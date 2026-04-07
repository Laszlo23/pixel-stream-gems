"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-6 lg:py-8 max-w-2xl">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
        <MessageCircle className="w-7 h-7 text-primary" />
        Messages
      </h1>
      <p className="text-sm text-muted-foreground mb-6">DMs and alerts — connect to your API + push.</p>
      <Card className="glass-panel border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Inbox (demo)</CardTitle>
          <CardDescription>No threads yet. Wire real-time chat server-side.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Notifications also surface tip milestones, drops, and competition updates.</CardContent>
      </Card>
    </div>
  );
}
