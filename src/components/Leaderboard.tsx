import { Link } from "react-router-dom";
import { Trophy, Coins } from "lucide-react";

interface Supporter {
  name: string;
  amount: number;
  level: number;
}

const supporters: Supporter[] = [
  { name: "CryptoKing", amount: 5200, level: 25 },
  { name: "PixelQueen", amount: 3100, level: 18 },
  { name: "NeonWolf", amount: 2400, level: 15 },
  { name: "GameMaster", amount: 1800, level: 12 },
  { name: "StarDust", amount: 950, level: 8 },
];

const medals = ["🥇", "🥈", "🥉"];

const Leaderboard = () => {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">Room leaderboard</h3>
        </div>
        <Link to="/competitions" className="text-[10px] text-primary hover:underline shrink-0">
          Global →
        </Link>
      </div>
      <div className="space-y-2">
        {supporters.map((s, i) => (
          <div key={s.name} className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2">
              <span className="text-sm w-6 text-center">
                {i < 3 ? medals[i] : <span className="text-xs text-muted-foreground">{i + 1}</span>}
              </span>
              <span className="text-xs font-medium text-foreground">{s.name}</span>
              <span className="text-[10px] text-muted-foreground">Lv.{s.level}</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Coins className="w-3 h-3" />
              <span className="text-xs font-semibold">{s.amount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
