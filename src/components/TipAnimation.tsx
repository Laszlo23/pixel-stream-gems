import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
}

interface TipAnimationProps {
  trigger: number;
  amount?: number;
}

const emojis = ["🪙", "💎", "⭐", "✨", "🔥", "🎉"];

const TipAnimation = ({ trigger }: TipAnimationProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 40,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 0.3,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(timer);
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-2xl animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${60 + p.y}%`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default TipAnimation;
