"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  fetchPresenterLines,
  isPresenterApiConfigured,
  PRESENTER_BOT_USERNAME,
} from "@/lib/presenterApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import { useAppPrivy } from "@/hooks/usePrivyCompat";
import ChatMessage from "@/components/ChatMessage";
import Leaderboard from "@/components/Leaderboard";
import MiniGame from "@/components/MiniGame";
import TipAnimation from "@/components/TipAnimation";
import { LiveSupportMeter } from "@/components/LiveSupportMeter";
import { NFTDropPanel } from "@/components/NFTDropPanel";
import { ChatGamesHub } from "@/components/ChatGamesHub";
import { ModerationBanner } from "@/components/ModerationBanner";
import { SimulatedPresentationBanner } from "@/components/SimulatedPresentationBanner";
import { LiveRoomBottomBar } from "@/components/LiveRoomBottomBar";
import { WebRtcRoom } from "@/components/stream/WebRtcRoom";
import { CreatorAmbientStage } from "@/components/creator/CreatorPublicMedia";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Star, Flame, Sparkles, Users, Clock, Bitcoin, ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import { getStreamerById, resolveStreamerAmbientVideoSrc, resolveStreamerPosterSrc, type StreamerMeta } from "@/data/streamers";
import { getCategoryShort } from "@/data/categories";
import { toast } from "sonner";
import { ArenaRoomProvider, useArenaRoom } from "@/contexts/ArenaRoomContext";
import { useLiveRoomChat } from "@/hooks/useLiveRoomChat";

interface Message {
  id: string | number;
  username: string;
  message: string;
  level: number;
  isTip?: boolean;
  tipAmount?: number;
  isSystem?: boolean;
  isPresenter?: boolean;
  holderSymbol?: string;
}

const reactions = ["❤️", "🔥", "😂", "👏", "🎉", "⚡"];

function LiveRoomContent({ streamer }: { streamer: StreamerMeta }) {
  const { authenticated, ready: privyReady } = useAppPrivy();
  const { address, isConnected } = useAccount();
  const chat = useLiveRoomChat(streamer.id);
  const { state, patchState } = useArenaRoom();
  const arenaXp = state.xp;
  const arenaLevel = Math.floor(arenaXp / 400) + 1;
  const levelProgress = arenaXp % 400;

  const initialMessages: Message[] = useMemo(
    () => [
      {
        id: 1,
        username: "System",
        message: `Welcome to ${streamer.name}'s stream — keep it friendly and on-topic.`,
        level: 0,
        isSystem: true,
      },
      {
        id: 2,
        username: "CryptoKing",
        message: "Let's gooo! 🔥",
        level: 25,
        holderSymbol: streamer.tokenSymbol,
      },
      { id: 3, username: "PixelQueen", message: "Love the vibes tonight", level: 18 },
      { id: 4, username: "NeonWolf", message: "", level: 15, isTip: true, tipAmount: 100 },
      { id: 5, username: "StarDust", message: "Can we play trivia?", level: 8 },
      {
        id: 6,
        username: "System",
        message: "🎯 Trivia round — first correct answer wins XP.",
        level: 0,
        isSystem: true,
      },
      { id: 7, username: "MoonRider", message: "First time here, this is awesome", level: 3 },
    ],
    [streamer.name, streamer.tokenSymbol],
  );

  const [offlineExtra, setOfflineExtra] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [tipTrigger, setTipTrigger] = useState(0);
  const [reactionBurst, setReactionBurst] = useState<string | null>(null);
  const [demoPublisher, setDemoPublisher] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOfflineExtra([]);
  }, [streamer.id]);

  const appendPresenterReplies = useCallback(
    async (userMessage: string | undefined, idle: boolean) => {
      const lines = await fetchPresenterLines(streamer.id, {
        userMessage,
        idle,
        personaName: streamer.name,
        streamCategory: streamer.category,
        presenterPersona: streamer.presenterPersona,
      });
      if (!lines.length) return;
      const stamp = Date.now();
      setOfflineExtra((prev) => [
        ...prev,
        ...lines.map((message, i) => ({
          id: `presenter-${stamp}-${i}`,
          username: PRESENTER_BOT_USERNAME,
          message,
          level: 24,
          isPresenter: true,
        })),
      ]);
    },
    [streamer.id, streamer.name, streamer.category, streamer.presenterPersona],
  );

  useEffect(() => {
    if (!isPresenterApiConfigured()) return;
    const demoAiLive = process.env.NEXT_PUBLIC_DEMO_AI_CHAT === "1";
    const allowIdle = !chat.connected || demoAiLive;
    if (!allowIdle) return;
    const tick = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      void appendPresenterReplies(undefined, true);
    };
    const first = window.setTimeout(tick, 18_000);
    const id = window.setInterval(tick, 52_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, [chat.connected, appendPresenterReplies]);

  const displayMessages = useMemo((): Message[] => {
    if (chat.connected) {
      return [
        {
          id: "sys-live-chat",
          username: "System",
          message: "You're connected to the live chat for this room (signaling server + gate).",
          level: 0,
          isSystem: true,
        },
        ...chat.remote.map((r) => ({
          id: r.id,
          username: r.username,
          message: r.message,
          level: r.level,
          isSystem: r.isSystem,
          isPresenter: false,
        })),
        ...offlineExtra,
      ];
    }
    return [...initialMessages, ...offlineExtra];
  }, [chat.connected, chat.remote, initialMessages, offlineExtra]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [displayMessages]);

  const sendMessage = () => {
    const text = inputMsg.trim();
    if (!text) return;
    if (chat.connected) {
      if (chat.send(text)) {
        setInputMsg("");
        patchState((prev) => ({
          ...prev,
          xp: prev.xp + 5,
          stats: { ...prev.stats, messagesSent: prev.stats.messagesSent + 1 },
        }));
        if (process.env.NEXT_PUBLIC_DEMO_AI_CHAT === "1" && isPresenterApiConfigured()) {
          void appendPresenterReplies(text, false);
        }
      }
      return;
    }
    const newMsg: Message = {
      id: `local-${Date.now()}`,
      username: "You",
      message: text,
      level: 7,
    };
    setOfflineExtra((prev) => [...prev, newMsg]);
    setInputMsg("");
    patchState((prev) => ({
      ...prev,
      xp: prev.xp + 5,
      stats: { ...prev.stats, messagesSent: prev.stats.messagesSent + 1 },
    }));
    if (isPresenterApiConfigured()) {
      void appendPresenterReplies(text, false);
    }
  };

  const sendTip = (amount: number) => {
    const newMsg: Message = {
      id: `tip-${Date.now()}`,
      username: "You",
      message: "",
      level: 7,
      isTip: true,
      tipAmount: amount,
    };
    setOfflineExtra((prev) => [...prev, newMsg]);
    setTipTrigger((prev) => prev + 1);
    patchState((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      stats: { ...prev.stats, tipsSent: prev.stats.tipsSent + 1 },
    }));
    toast.message("Tip sent", { description: `${amount} coins to ${streamer.name} (demo).` });
  };

  const sendReaction = (emoji: string) => {
    setReactionBurst(emoji);
    setTimeout(() => setReactionBurst(null), 800);
    patchState((prev) => ({
      ...prev,
      xp: prev.xp + 2,
      stats: { ...prev.stats, reactionsSent: prev.stats.reactionsSent + 1 },
    }));
  };

  const scrollToSupport = useCallback(() => {
    document.getElementById("live-support-meter")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="min-h-full bg-background pb-28 lg:pb-24">
      <TipAnimation trigger={tipTrigger} />

      {reactionBurst && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <span className="text-7xl animate-scale-in">{reactionBurst}</span>
        </div>
      )}

      <main className="pt-4 px-4 pb-6">
        <div className="app-shell space-y-4">
          <div className="glass-panel flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 rounded-xl bg-background/50 px-3 py-1.5 border border-border/50">
              <Users className="w-4 h-4 text-[hsl(var(--neon-blue))]" />
              <span className="text-muted-foreground">Live</span>
              <span className="font-bold tabular-nums text-foreground">{streamer.viewers.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background/50 px-3 py-1.5 border border-border/50">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Tips today</span>
              <span className="font-bold tabular-nums text-[hsl(var(--gold))]">$4,280</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-background/50 px-3 py-1.5 border border-border/50">
              <Trophy className="w-4 h-4 text-[hsl(var(--gold))]" />
              <span className="text-muted-foreground">Competition</span>
              <span className="font-semibold text-foreground">#3 Tip blitz</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="ghost" size="icon" className="rounded-xl shrink-0" asChild>
                <Link href="/" aria-label="Back">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-semibold text-foreground tracking-tight">{streamer.name}</h1>
                  <Badge variant="outline" className="rounded-lg text-[10px] font-normal">
                    {getCategoryShort(streamer.marketCategory)}
                  </Badge>
                  <Badge variant="secondary" className="rounded-lg font-mono text-[10px]">
                    ${streamer.tokenSymbol}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Bitcoin className="w-3 h-3" />
                    Pool: {streamer.tokenSymbol}/{streamer.btcPeg} · {streamer.poolTvlUsd}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-xs text-muted-foreground">{streamer.category}</p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <Button variant="link" className="h-auto p-0 text-xs text-primary" asChild>
                    <Link href={`/u/${streamer.id}`}>Creator profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <ModerationBanner />

          <SimulatedPresentationBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
              <div className="flex items-center justify-end gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2">
                <Label htmlFor="demo-publisher" className="text-xs text-muted-foreground cursor-pointer">
                  Demo: act as broadcaster (WebRTC)
                </Label>
                <Switch id="demo-publisher" checked={demoPublisher} onCheckedChange={setDemoPublisher} />
              </div>
              <WebRtcRoom
                roomId={`public:${streamer.id}`}
                isPublisher={demoPublisher}
                ambientCreator={{
                  creatorId: streamer.id,
                  posterSrc: resolveStreamerPosterSrc(streamer, "16x9"),
                  videoSrc: resolveStreamerAmbientVideoSrc(streamer),
                  bare: true,
                }}
              />
              <CreatorAmbientStage
                creatorId={streamer.id}
                bare
                posterSrc={resolveStreamerPosterSrc(streamer, "16x9")}
                videoSrc={resolveStreamerAmbientVideoSrc(streamer)}
                className="relative flex-1 min-h-[200px] md:min-h-[240px] rounded-2xl overflow-hidden border border-border/80 flex items-center justify-center"
                placeholder={
                  <div className="text-center">
                    <span className="text-7xl mb-4 block text-white/20 animate-float">{streamer.avatar}</span>
                    <p className="font-semibold text-lg text-foreground">{streamer.name}</p>
                    <p className="text-sm text-muted-foreground">{streamer.category}</p>
                  </div>
                }
              >
                <div className="absolute top-4 left-4 z-[3] flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-destructive/90 px-3 py-1.5 rounded-full">
                    <div className="live-dot" />
                    <span className="text-xs font-semibold text-destructive-foreground">LIVE</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-background/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50">
                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">{streamer.viewers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-background/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/50">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-foreground">2:34:12</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-[3]">
                  <div className="surface-card px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-card/90 backdrop-blur-md border-border/80">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Lv.{arenaLevel}</span>
                      </div>
                      <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${(levelProgress / 400) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {arenaXp} XP · {state.gemCredits} GEM
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-destructive" />
                      <span className="text-xs text-muted-foreground">Goal: 5K / 10K</span>
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full w-1/2 rounded-full bg-destructive" />
                      </div>
                    </div>
                  </div>
                </div>
              </CreatorAmbientStage>

              <LiveSupportMeter
                creatorName={streamer.name}
                tokenSymbol={streamer.tokenSymbol}
                flowReceiver={process.env.NEXT_PUBLIC_DEFAULT_FLOW_RECEIVER as `0x${string}` | undefined}
              />

              <div className="surface-card p-3 rounded-2xl">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Reactions</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {reactions.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => sendReaction(r)}
                      className="w-9 h-9 rounded-xl bg-secondary hover:bg-accent hover:scale-110 flex items-center justify-center transition-all duration-150 text-lg"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-1">Live arena</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <ChatGamesHub viewerBaseline={streamer.viewers} className="sm:col-span-1" />
                  <div className="sm:col-span-2 space-y-3">
                    <NFTDropPanel tokenSymbol={streamer.tokenSymbol} />
                    <MiniGame />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 min-h-0 lg:max-h-[calc(100vh-8rem)]">
              <div className="surface-card flex flex-col flex-1 min-h-[320px] lg:min-h-0 lg:flex-[2] rounded-2xl overflow-hidden border-border/80">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-medium text-sm text-foreground">Live chat</span>
                    {chat.connected && (
                      <span className="text-[9px] uppercase tracking-wide text-primary font-semibold shrink-0">Live</span>
                    )}
                    {isPresenterApiConfigured() && (!chat.connected || process.env.NEXT_PUBLIC_DEMO_AI_CHAT === "1") && (
                      <span className="text-[9px] uppercase tracking-wide text-muted-foreground font-semibold shrink-0">
                        + AI presenter
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-muted-foreground block">
                      {streamer.viewers.toLocaleString()} watching
                    </span>
                    {chat.error && (
                      <span className="text-[9px] text-destructive block max-w-[140px] truncate" title={chat.error}>
                        {chat.error}
                      </span>
                    )}
                  </div>
                </div>
                <div ref={chatRef} className="flex-1 overflow-y-auto py-2 min-h-0">
                  {displayMessages.map((m) => (
                    <ChatMessage key={String(m.id)} {...m} />
                  ))}
                </div>
                <div className="p-3 border-t border-border space-y-2">
                  {privyReady && (!authenticated || !isConnected || !address) && (
                    <p className="text-[10px] text-muted-foreground">
                      <Link href="/sign-in" className="text-primary hover:underline">
                        Sign in
                      </Link>{" "}
                      to sync live chat with other viewers (wallet required for the gate).
                    </p>
                  )}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      sendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={inputMsg}
                      onChange={(e) => setInputMsg(e.target.value)}
                      placeholder={
                        chat.connected
                          ? "Message the room…"
                          : authenticated && isConnected
                            ? "Local preview (connect gate to sync)…"
                            : "Say something nice…"
                      }
                      className="flex-1 text-xs bg-secondary border-border rounded-xl"
                      disabled={chat.connected && (!authenticated || !isConnected || !address)}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="default"
                      className="rounded-xl shrink-0"
                      disabled={chat.connected && (!authenticated || !isConnected || !address)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>

              <Leaderboard />
            </div>
          </div>
        </div>
      </main>

      <LiveRoomBottomBar
        tokenSymbol={streamer.tokenSymbol}
        btcPeg={streamer.btcPeg}
        onTip={sendTip}
        onScrollToSupport={scrollToSupport}
      />
    </div>
  );
}

const LiveRoom = () => {
  const params = useParams<{ id?: string }>();
  const raw = params?.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const streamer = useMemo(() => getStreamerById(id), [id]);

  return (
    <ArenaRoomProvider roomId={streamer.id}>
      <LiveRoomContent streamer={streamer} />
    </ArenaRoomProvider>
  );
};

export default LiveRoom;
