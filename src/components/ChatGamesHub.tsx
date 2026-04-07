import { useState } from "react";
import { Brain, Dices, Swords, Zap, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ChatGamesHubProps {
  onReward?: (label: string) => void;
  className?: string;
}

export function ChatGamesHub({ onReward, className }: ChatGamesHubProps) {
  const [triviaPick, setTriviaPick] = useState<number | null>(null);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [battle, setBattle] = useState<"a" | "b" | null>(null);
  const [rallyA, setRallyA] = useState(42);
  const [rallyB, setRallyB] = useState(38);
  const [prediction, setPrediction] = useState<"over" | "under" | null>(null);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  const answerTrivia = (idx: number) => {
    setTriviaPick(idx);
    if (idx === 1) {
      onReward?.("+25 XP · trivia");
    }
  };

  const spinWheel = () => {
    setWheelSpinning(true);
    setWheelResult(null);
    setTimeout(() => {
      const outcomes = ["+10 XP", "+50 $GEM", "Badge shard", "NFT raffle entry", "Priority chat 5m"];
      const pick = outcomes[Math.floor(Math.random() * outcomes.length)];
      setWheelResult(pick);
      setWheelSpinning(false);
      onReward?.(pick);
    }, 900);
  };

  const pickBattle = (side: "a" | "b") => {
    setBattle(side);
    onReward?.(`Battle · team ${side.toUpperCase()}`);
  };

  const tipRally = (side: "a" | "b") => {
    if (side === "a") {
      setRallyA((v) => v + 5);
    } else {
      setRallyB((v) => v + 5);
    }
    onReward?.(`Tip rally · team ${side === "a" ? "Aurora" : "Nova"}`);
  };

  const lockPrediction = (side: "over" | "under") => {
    setPrediction(side);
    const actual: "over" | "under" = Math.random() > 0.45 ? "over" : "under";
    const win = side === actual;
    setPredictionResult(
      win
        ? `Locked ${side}! Outcome ${actual} — you win XP + raffle ticket.`
        : `Outcome was ${actual}. Better luck next round.`,
    );
    if (win) onReward?.("Prediction win · +40 XP");
  };

  const rallyTotal = rallyA + rallyB || 1;

  return (
    <div className={cn("surface-card p-4 rounded-2xl", className)}>
      <Tabs defaultValue="trivia" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 rounded-xl bg-secondary/80 p-1 justify-start">
          <TabsTrigger value="trivia" className="rounded-lg text-[11px] gap-1 py-2 px-2">
            <Brain className="w-3 h-3 shrink-0" /> Trivia
          </TabsTrigger>
          <TabsTrigger value="wheel" className="rounded-lg text-[11px] gap-1 py-2 px-2">
            <Dices className="w-3 h-3 shrink-0" /> Wheel
          </TabsTrigger>
          <TabsTrigger value="battle" className="rounded-lg text-[11px] gap-1 py-2 px-2">
            <Swords className="w-3 h-3 shrink-0" /> Battles
          </TabsTrigger>
          <TabsTrigger value="rally" className="rounded-lg text-[11px] gap-1 py-2 px-2">
            <Zap className="w-3 h-3 shrink-0" /> Rally
          </TabsTrigger>
          <TabsTrigger value="predict" className="rounded-lg text-[11px] gap-1 py-2 px-2">
            <LineChart className="w-3 h-3 shrink-0" /> Predict
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trivia" className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground">First correct answer in chat wins creator tokens or XP.</p>
          <p className="text-sm font-medium text-foreground">What chain is Gems anchored on for wallets?</p>
          <div className="flex flex-wrap gap-2">
            {["Solana", "Base", "Bitcoin L1"].map((opt, i) => (
              <Button
                key={opt}
                size="sm"
                variant={triviaPick === i ? "default" : "secondary"}
                className="rounded-xl text-xs"
                disabled={triviaPick !== null}
                onClick={() => answerTrivia(i)}
              >
                {opt}
              </Button>
            ))}
          </div>
          {triviaPick !== null && (
            <p className="text-xs text-primary">
              {triviaPick === 1 ? "Correct — rewards fire on-chain in production." : "Nice try — creators can run the next round."}
            </p>
          )}
        </TabsContent>

        <TabsContent value="wheel" className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">Supporter-only spins — perks, XP, or raffle entries.</p>
          <div className="flex items-center justify-center py-4">
            <button
              type="button"
              onClick={spinWheel}
              disabled={wheelSpinning}
              className={cn(
                "w-24 h-24 rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary/20 to-transparent",
                "flex items-center justify-center text-2xl transition-transform",
                wheelSpinning && "animate-spin duration-700",
              )}
            >
              🎡
            </button>
          </div>
          {wheelResult && <p className="text-center text-sm font-medium text-foreground">You won: {wheelResult}</p>}
        </TabsContent>

        <TabsContent value="battle" className="mt-3 space-y-2">
          <p className="text-xs text-muted-foreground">Two teams compete for a pool of creator tokens.</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={battle === "a" ? "default" : "secondary"}
              className="rounded-xl h-auto py-3 flex flex-col gap-1"
              onClick={() => pickBattle("a")}
            >
              <span className="text-xs font-semibold">Team Aurora</span>
              <span className="text-[10px] text-muted-foreground">62%</span>
            </Button>
            <Button
              variant={battle === "b" ? "default" : "secondary"}
              className="rounded-xl h-auto py-3 flex flex-col gap-1"
              onClick={() => pickBattle("b")}
            >
              <span className="text-xs font-semibold">Team Nova</span>
              <span className="text-[10px] text-muted-foreground">38%</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="rally" className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">Tips and flows add energy to each side — winner gets a bonus NFT raffle.</p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Aurora</span>
              <span>Nova</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(rallyA / rallyTotal) * 100}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" className="rounded-xl text-xs" onClick={() => tipRally("a")}>
              +5 Aurora
            </Button>
            <Button variant="secondary" className="rounded-xl text-xs" onClick={() => tipRally("b")}>
              +5 Nova
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="predict" className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">Predict the stream outcome — winners earn XP and NFT raffle weight.</p>
          <p className="text-sm font-medium text-foreground">Viewers at top of hour: over or under 2,500?</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={prediction === "over" ? "default" : "secondary"}
              className="rounded-xl text-xs"
              disabled={prediction !== null}
              onClick={() => lockPrediction("over")}
            >
              Over 2.5k
            </Button>
            <Button
              variant={prediction === "under" ? "default" : "secondary"}
              className="rounded-xl text-xs"
              disabled={prediction !== null}
              onClick={() => lockPrediction("under")}
            >
              Under 2.5k
            </Button>
          </div>
          {predictionResult && <p className="text-xs text-primary leading-relaxed">{predictionResult}</p>}
          {prediction !== null && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs w-full"
              onClick={() => {
                setPrediction(null);
                setPredictionResult(null);
              }}
            >
              Next round
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
