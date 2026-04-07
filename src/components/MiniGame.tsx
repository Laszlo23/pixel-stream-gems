import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gamepad2, RotateCcw } from "lucide-react";

const MiniGame = () => {
  const [gameActive, setGameActive] = useState(false);
  const [guess, setGuess] = useState<number | null>(null);
  const [target] = useState(() => Math.floor(Math.random() * 10) + 1);
  const [result, setResult] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);

  const handleGuess = (num: number) => {
    setGuess(num);
    if (num === target) {
      setResult("🎉 You got it! +50 XP");
      setXpEarned(50);
    } else if (Math.abs(num - target) <= 2) {
      setResult(`Close! It was ${target}. +10 XP`);
      setXpEarned(10);
    } else {
      setResult(`Nope! It was ${target}. +5 XP`);
      setXpEarned(5);
    }
  };

  const reset = () => {
    setGameActive(false);
    setGuess(null);
    setResult(null);
    setXpEarned(0);
  };

  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">Mini Game</h3>
        </div>
        {(gameActive || result) && (
          <button onClick={reset} className="text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {!gameActive && !result && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground mb-3">Guess the number (1-10)</p>
          <Button size="sm" onClick={() => setGameActive(true)}>
            Play Now
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
        <div className="text-center py-2 animate-scale-in">
          <p className="text-sm font-medium text-foreground mb-1">{result}</p>
          {xpEarned > 0 && (
            <p className="text-xs text-primary">+{xpEarned} XP earned!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniGame;
