import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ChatMessage from "@/components/ChatMessage";
import Leaderboard from "@/components/Leaderboard";
import MiniGame from "@/components/MiniGame";
import TipAnimation from "@/components/TipAnimation";
import { LiveSupportMeter } from "@/components/LiveSupportMeter";
import { NFTDropPanel } from "@/components/NFTDropPanel";
import { ChatGamesHub } from "@/components/ChatGamesHub";
import { ModerationBanner } from "@/components/ModerationBanner";
import { LiveRoomBottomBar } from "@/components/LiveRoomBottomBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Star, Flame, Sparkles, Users, Clock, Bitcoin, ArrowLeft } from "lucide-react";
import { getStreamerById } from "@/data/streamers";
import { getCategoryShort } from "@/data/categories";
import { toast } from "sonner";

interface Message {
  id: number;
  username: string;
  message: string;
  level: number;
  isTip?: boolean;
  tipAmount?: number;
  isSystem?: boolean;
  holderSymbol?: string;
}

const reactions = ["❤️", "🔥", "😂", "👏", "🎉", "⚡"];

const LiveRoom = () => {
  const { id } = useParams();
  const streamer = useMemo(() => getStreamerById(id), [id]);

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

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMsg, setInputMsg] = useState("");
  const [tipTrigger, setTipTrigger] = useState(0);
  const [xp, setXp] = useState(420);
  const [reactionBurst, setReactionBurst] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!inputMsg.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      username: "You",
      message: inputMsg,
      level: 7,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg("");
    setXp((prev) => prev + 5);
  };

  const sendTip = (amount: number) => {
    const newMsg: Message = {
      id: Date.now(),
      username: "You",
      message: "",
      level: 7,
      isTip: true,
      tipAmount: amount,
    };
    setMessages((prev) => [...prev, newMsg]);
    setTipTrigger((prev) => prev + 1);
    setXp((prev) => prev + amount);
    toast.message("Tip sent", { description: `${amount} coins to ${streamer.name} (demo).` });
  };

  const sendReaction = (emoji: string) => {
    setReactionBurst(emoji);
    setTimeout(() => setReactionBurst(null), 800);
    setXp((prev) => prev + 2);
  };

  const onGameReward = (label: string) => {
    toast("Reward", { description: label });
    setXp((x) => x + 15);
  };

  const scrollToSupport = useCallback(() => {
    document.getElementById("live-support-meter")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-28">
      <Navbar />
      <TipAnimation trigger={tipTrigger} />

      {reactionBurst && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <span className="text-7xl animate-scale-in">{reactionBurst}</span>
        </div>
      )}

      <main className="pt-16 px-4 pb-6">
        <div className="container mx-auto max-w-[1400px] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="ghost" size="icon" className="rounded-xl shrink-0" asChild>
                <Link to="/" aria-label="Back">
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
                    <Link to={`/u/${streamer.id}`}>Creator profile</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <ModerationBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:items-stretch">
            <div className="lg:col-span-2 flex flex-col gap-4 min-h-0">
              <div className="relative flex-1 min-h-[280px] md:min-h-[360px] rounded-2xl overflow-hidden bg-secondary flex items-center justify-center border border-border/80">
                <div className="text-center px-4">
                  <span className="text-7xl mb-4 block animate-float">{streamer.avatar}</span>
                  <p className="font-semibold text-lg text-foreground">{streamer.name}</p>
                  <p className="text-sm text-muted-foreground">{streamer.category}</p>
                </div>
                <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
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

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="surface-card px-4 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl bg-card/90 backdrop-blur-md border-border/80">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">Lv.7</span>
                      </div>
                      <div className="w-32 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${(xp % 1000) / 10}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{xp} XP</span>
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
              </div>

              <LiveSupportMeter creatorName={streamer.name} tokenSymbol={streamer.tokenSymbol} />

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

              <NFTDropPanel tokenSymbol={streamer.tokenSymbol} />
            </div>

            <div className="flex flex-col gap-4 min-h-0 lg:max-h-[calc(100vh-8rem)]">
              <div className="surface-card flex flex-col flex-1 min-h-[320px] lg:min-h-0 lg:flex-[2] rounded-2xl overflow-hidden border-border/80">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm text-foreground">Live chat</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{streamer.viewers.toLocaleString()} watching</span>
                </div>
                <div ref={chatRef} className="flex-1 overflow-y-auto py-2 min-h-0">
                  {messages.map((m) => (
                    <ChatMessage key={m.id} {...m} />
                  ))}
                </div>
                <div className="p-3 border-t border-border">
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
                      placeholder="Say something nice…"
                      className="flex-1 text-xs bg-secondary border-border rounded-xl"
                    />
                    <Button type="submit" size="icon" variant="default" className="rounded-xl shrink-0">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>

              <ChatGamesHub onReward={onGameReward} className="shrink-0" />
              <Leaderboard />
              <MiniGame />
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
};

export default LiveRoom;
