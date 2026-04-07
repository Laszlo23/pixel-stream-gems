"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Gamepad2, RotateCcw } from "lucide-react";
import { useArenaRoom } from "@/contexts/ArenaRoomContext";

function randomTarget(): number {
  return Math.floor(Math.random() * 10) + 1;
}

const MiniGame = () => {
  const { applyReward } = useArenaRoom();
  const [gameActive, setGameActive] = useState(false);
  const [target, setTarget] = useState(randomTarget);
  const [guess, setGuess] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);

  const handleGuess = (num: number) => {
    setGuess(num);
    let xp = 5;
    let msg: string;
    if (num === target) {
      xp = 50;
      msg = `🎉 You got it! The number was ${target}.`;
    } else if (Math.abs(num - target) <= 2) {
      xp = 10;
      msg = `Close! The number was ${target}.`;
    } else {
      msg = `Nope! The number was ${target}.`;
    }
    setResult(msg);
    setXpEarned(xp);
    applyReward(
      { xp, label: `Number guess · ${xp} XP` },
      (prev) => ({
        numberGamePlays: prev.stats.numberGamePlays + 1,
        numberGameWins: num === target ? prev.stats.numberGameWins + 1 : prev.stats.numberGameWins,
      }),
    );
    toast.message(xp >= 50 ? "Nice!" : "Round complete", { description: `+${xp} XP saved to this room.` });
  };

  const reset = useCallback(() => {
    setGameActive(false);
    setGuess(null);
    setResult(null);
    setXpEarned(0);
    setTarget(randomTarget());
  }, []);

  const playAgain = () => {
    setGuess(null);
    setResult(null);
    setXpEarned(0);
    setTarget(randomTarget());
    setGameActive(true);
  };

  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">Number guess</h3>
        </div>
        {(gameActive || result) && (
          <button type="button" onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Reset game">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!gameActive && !result && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground mb-3">Guess the secret number from 1–10 (new number each round).</p>
          <Button size="sm" onClick={() => setGameActive(true)}>
            Play now
          </Button>
        </div>
      )}

      {gameActive && !result && (
        <div className="animate-scale-in">
          <p className="text-xs text-muted-foreground text-center mb-3">Pick a number!</p>
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleGuess(n)}
                className="h-8 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-xs font-medium transition-colors duration-150"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className="text-center py-2 animate-scale-in space-y-2">
          <p className="text-sm font-medium text-foreground mb-1">{result}</p>
          {guess !== null && (
            <p className="text-[10px] text-muted-foreground">Your pick: {guess}</p>
          )}
          {xpEarned > 0 && <p className="text-xs text-primary">+{xpEarned} XP saved</p>}
          <Button size="sm" variant="secondary" className="rounded-xl" onClick={playAgain}>
            Play again
          </Button>
        </div>
      )}
    </div>
  );
};

export default MiniGame;
