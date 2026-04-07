"use client";

import { useCallback, useMemo, useState } from "react";
import { Brain, Dices, Swords, Zap, LineChart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ARENA_TRIVIA } from "@/data/arenaTrivia";
import { useArenaRoom } from "@/contexts/ArenaRoomContext";

interface ChatGamesHubProps {
  className?: string;
  /** Simulated “viewer count” line for the prediction game */
  viewerBaseline: number;
}

type WheelSlice = { label: string; xp: number; gems?: number };

const WHEEL_SLICES: WheelSlice[] = [
  { label: "+10 XP", xp: 10 },
  { label: "+25 XP", xp: 25 },
  { label: "+50 demo $GEM", xp: 0, gems: 50 },
  { label: "+15 XP", xp: 15 },
  { label: "Badge shard (+20 XP)", xp: 20 },
  { label: "Raffle weight (+30 XP)", xp: 30 },
];

export function ChatGamesHub({ className, viewerBaseline }: ChatGamesHubProps) {
  const { state, applyReward, patchState } = useArenaRoom();

  const [triviaQ, setTriviaQ] = useState(0);
  const [triviaPick, setTriviaPick] = useState<number | null>(null);

  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  const [battleChoice, setBattleChoice] = useState<"a" | "b" | null>(null);
  const [battleOutcome, setBattleOutcome] = useState<"a" | "b" | null>(null);

  const [prediction, setPrediction] = useState<"over" | "under" | null>(null);
  const [predictionDetail, setPredictionDetail] = useState<string | null>(null);

  const q = ARENA_TRIVIA[triviaQ % ARENA_TRIVIA.length];

  const rallyTotal = state.rallyA + state.rallyB || 1;
  const pctA = Math.round((state.rallyA / rallyTotal) * 100);
  const pctB = 100 - pctA;

  const answerTrivia = (idx: number) => {
    if (triviaPick !== null) return;
    setTriviaPick(idx);
    const correct = idx === q.correctIndex;
    if (correct) {
      applyReward(
        { xp: 25, label: "Trivia · correct" },
        (prev) => ({ triviaCorrect: prev.stats.triviaCorrect + 1 }),
      );
      toast.success("Correct", { description: "+25 XP saved to this room." });
    } else {
      applyReward(
        { xp: 5, label: "Trivia · participation" },
        (prev) => ({ triviaWrong: prev.stats.triviaWrong + 1 }),
      );
      toast.message("Not quite", { description: "+5 XP for playing. Read the explanation below." });
    }
  };

  const nextTrivia = () => {
    setTriviaPick(null);
    setTriviaQ((i) => i + 1);
  };

  const spinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    setWheelResult(null);
    window.setTimeout(() => {
      const slice = WHEEL_SLICES[Math.floor(Math.random() * WHEEL_SLICES.length)];
      applyReward(
        { xp: slice.xp, gems: slice.gems, label: `Wheel · ${slice.label}` },
        (prev) => ({ wheelSpins: prev.stats.wheelSpins + 1 }),
      );
      setWheelResult(slice.label);
      setWheelSpinning(false);
      toast.success("Spin result", { description: slice.label });
    }, 900);
  };

  const pickBattle = (side: "a" | "b") => {
    if (battleOutcome !== null) return;
    setBattleChoice(side);
  };

  const resolveBattle = () => {
    if (!battleChoice || battleOutcome !== null) return;
    const wA = state.rallyA + 1;
    const wB = state.rallyB + 1;
    const roll = Math.random() * (wA + wB);
    const winner: "a" | "b" = roll < wA ? "a" : "b";
    setBattleOutcome(winner);
    const won = battleChoice === winner;
    if (won) {
      applyReward(
        { xp: 30, label: `Battle · Team ${winner === "a" ? "Aurora" : "Nova"} wins (you called it)` },
        (prev) => ({ battlesWon: prev.stats.battlesWon + 1 }),
      );
      toast.success("Your team won the round", { description: "+30 XP" });
    } else {
      applyReward(
        { xp: 8, label: "Battle · loss" },
        (prev) => ({ battlesLost: prev.stats.battlesLost + 1 }),
      );
      toast.message("Other team took it", { description: "+8 XP for competing." });
    }
  };

  const newBattle = () => {
    setBattleChoice(null);
    setBattleOutcome(null);
  };

  const tipRally = (side: "a" | "b") => {
    patchState((prev) => ({
      ...prev,
      rallyA: side === "a" ? prev.rallyA + 5 : prev.rallyA,
      rallyB: side === "b" ? prev.rallyB + 5 : prev.rallyB,
    }));
    toast.message("Rally boost", { description: `+5 to Team ${side === "a" ? "Aurora" : "Nova"}` });
  };

  const predictThreshold = 2500;
  const lockPrediction = useCallback(
    (side: "over" | "under") => {
      if (prediction !== null) return;
      setPrediction(side);
      const noise = Math.floor(Math.random() * 501) - 250;
      const actual = Math.max(400, viewerBaseline + noise);
      const outcome: "over" | "under" = actual >= predictThreshold ? "over" : "under";
      const win = side === outcome;
      setPredictionDetail(
        `Counted viewers (simulated): ${actual.toLocaleString()} — line was ${predictThreshold.toLocaleString()}. Outcome: ${outcome}.`,
      );
      if (win) {
        applyReward(
          { xp: 40, label: "Prediction · correct" },
          (prev) => ({ predictionsWon: prev.stats.predictionsWon + 1 }),
        );
        toast.success("Prediction hit", { description: "+40 XP" });
      } else {
        applyReward(
          { xp: 6, label: "Prediction · miss" },
          (prev) => ({ predictionsLost: prev.stats.predictionsLost + 1 }),
        );
        toast.message("Missed", { description: "+6 XP — try the next round." });
      }
    },
    [applyReward, prediction, viewerBaseline],
  );

  const nextPredictionRound = () => {
    setPrediction(null);
    setPredictionDetail(null);
  };

  const statsLine = useMemo(
    () =>
      `Room stats · trivia ${state.stats.triviaCorrect}/${state.stats.triviaCorrect + state.stats.triviaWrong} · spins ${state.stats.wheelSpins} · battles W/L ${state.stats.battlesWon}/${state.stats.battlesLost} · GEM ${state.gemCredits}`,
    [state.stats, state.gemCredits],
  );

  return (
    <div className={cn("surface-card p-4 rounded-2xl", className)}>
      <p className="text-[10px] text-muted-foreground mb-2 leading-snug px-0.5">{statsLine}</p>
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
          <p className="text-xs text-muted-foreground">Answer from the choices below — XP is saved for this stream (browser).</p>
          <p className="text-sm font-medium text-foreground">{q.question}</p>
          <div className="flex flex-wrap gap-2">
            {q.options.map((opt, i) => (
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
            <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-3">
              <p className="text-xs text-primary font-medium">
                {triviaPick === q.correctIndex ? "Correct." : "Incorrect."}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{q.explanation}</p>
              <Button size="sm" variant="outline" className="rounded-xl text-xs" onClick={nextTrivia}>
                Next question
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="wheel" className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">Random outcome — XP and demo $GEM credits persist in this room.</p>
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
          <p className="text-xs text-muted-foreground">
            Pick a team, then resolve. Win odds skew slightly toward the team ahead on the Rally bar.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={battleChoice === "a" ? "default" : "secondary"}
              className="rounded-xl h-auto py-3 flex flex-col gap-1"
              disabled={battleOutcome !== null}
              onClick={() => pickBattle("a")}
            >
              <span className="text-xs font-semibold">Team Aurora</span>
              <span className="text-[10px] text-muted-foreground">{pctA}% rally</span>
            </Button>
            <Button
              variant={battleChoice === "b" ? "default" : "secondary"}
              className="rounded-xl h-auto py-3 flex flex-col gap-1"
              disabled={battleOutcome !== null}
              onClick={() => pickBattle("b")}
            >
              <span className="text-xs font-semibold">Team Nova</span>
              <span className="text-[10px] text-muted-foreground">{pctB}% rally</span>
            </Button>
          </div>
          {battleChoice && battleOutcome === null && (
            <Button className="w-full rounded-xl text-xs" onClick={resolveBattle}>
              Resolve this round
            </Button>
          )}
          {battleOutcome !== null && (
            <div className="space-y-2">
              <p className="text-xs text-foreground">
                Winner: Team {battleOutcome === "a" ? "Aurora" : "Nova"}
                {battleChoice === battleOutcome ? " — you called it." : " — your pick didn’t land."}
              </p>
              <Button variant="outline" size="sm" className="rounded-xl text-xs w-full" onClick={newBattle}>
                New battle
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rally" className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">Boost a side — totals persist and feed battle odds.</p>
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Aurora · {state.rallyA}</span>
              <span>Nova · {state.rallyB}</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(state.rallyA / rallyTotal) * 100}%` }}
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
          <p className="text-xs text-muted-foreground">
            Simulated headcount vs {predictThreshold.toLocaleString()} (noise around the live viewer count shown in the
            header).
          </p>
          <p className="text-sm font-medium text-foreground">Viewers at snapshot: over or under {predictThreshold.toLocaleString()}?</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={prediction === "over" ? "default" : "secondary"}
              className="rounded-xl text-xs"
              disabled={prediction !== null}
              onClick={() => lockPrediction("over")}
            >
              Over
            </Button>
            <Button
              variant={prediction === "under" ? "default" : "secondary"}
              className="rounded-xl text-xs"
              disabled={prediction !== null}
              onClick={() => lockPrediction("under")}
            >
              Under
            </Button>
          </div>
          {predictionDetail && <p className="text-xs text-primary leading-relaxed">{predictionDetail}</p>}
          {prediction !== null && (
            <Button variant="outline" size="sm" className="rounded-xl text-xs w-full" onClick={nextPredictionRound}>
              Next round
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
