import { useMemo, useState } from "react";
import { Activity, Pause, Play, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface ActiveStream {
  id: string;
  supporter: string;
  rateLabel: string;
  flowPerHourUsd: number;
}

const FLOW_PRESETS = [
  { id: "p05", label: "$0.05 / min", flowPerHourUsd: 3 },
  { id: "p10", label: "$0.10 / min", flowPerHourUsd: 6 },
  { id: "h1", label: "$1 / hr", flowPerHourUsd: 1 },
  { id: "h5", label: "$5 / hr", flowPerHourUsd: 5 },
] as const;

const demoStreams: ActiveStream[] = [
  { id: "1", supporter: "orbit.eth", rateLabel: "$0.05 / min", flowPerHourUsd: 3 },
  { id: "2", supporter: "lumen.base", rateLabel: "$1 / hr", flowPerHourUsd: 1 },
  { id: "3", supporter: "fan_42", rateLabel: "$0.10 / min", flowPerHourUsd: 6 },
];

interface LiveSupportMeterProps {
  creatorName: string;
  tokenSymbol: string;
  className?: string;
}

export function LiveSupportMeter({ creatorName, tokenSymbol, className }: LiveSupportMeterProps) {
  const [streaming, setStreaming] = useState(false);
  const [presetId, setPresetId] = useState<(typeof FLOW_PRESETS)[number]["id"]>("p10");
  const [localStreams, setLocalStreams] = useState<ActiveStream[]>(demoStreams);

  const selectedPreset = FLOW_PRESETS.find((p) => p.id === presetId) ?? FLOW_PRESETS[1];

  const totalFlow = useMemo(
    () => localStreams.reduce((a, s) => a + s.flowPerHourUsd, 0),
    [localStreams],
  );

  const toggleDemoStream = () => {
    setStreaming((s) => !s);
    if (!streaming) {
      setLocalStreams((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          supporter: "you",
          rateLabel: selectedPreset.label,
          flowPerHourUsd: selectedPreset.flowPerHourUsd,
        },
      ]);
    } else {
      setLocalStreams((prev) => prev.filter((x) => x.supporter !== "you"));
    }
  };

  return (
    <div id="live-support-meter" className={cn("surface-card p-4 rounded-2xl space-y-4", className)}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">Live Support Meter</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Superfluid money streaming on Base — USDC / ETH flows to {creatorName}. Wrap to Super Tokens in production;
              this UI demos rates vs the {`$${tokenSymbol}`} economy.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant={streaming ? "secondary" : "default"}
          className="rounded-xl gap-1.5 shrink-0 self-start"
          onClick={toggleDemoStream}
        >
          {streaming ? (
            <>
              <Pause className="w-3.5 h-3.5" /> Stop flow
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" /> Start streaming support
            </>
          )}
        </Button>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Your flow rate</p>
        <div className="flex flex-wrap gap-2">
          {FLOW_PRESETS.map((p) => (
            <Button
              key={p.id}
              type="button"
              size="sm"
              variant={presetId === p.id ? "default" : "outline"}
              className="rounded-xl text-xs h-8"
              disabled={streaming}
              onClick={() => setPresetId(p.id)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-secondary/50 border border-border/60 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Active flows</p>
          <p className="text-2xl font-semibold tabular-nums text-foreground">{localStreams.length}</p>
        </div>
        <div className="rounded-xl bg-secondary/50 border border-border/60 p-3 sm:col-span-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Real-time income (est. / hr)</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-semibold tabular-nums text-foreground">${totalFlow.toFixed(1)}</p>
            <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3 text-primary" />
              live
            </span>
          </div>
          <Progress value={Math.min(100, totalFlow * 4)} className="h-1.5 mt-2" />
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Top supporters (by flow)</p>
        <ul className="space-y-2">
          {localStreams
            .slice()
            .sort((a, b) => b.flowPerHourUsd - a.flowPerHourUsd)
            .map((s, i) => (
              <li
                key={s.id}
                className="flex items-center justify-between text-xs rounded-xl bg-muted/30 px-3 py-2 border border-border/50"
              >
                <span className="text-muted-foreground w-5">{i + 1}</span>
                <span className="flex-1 font-medium text-foreground truncate px-2">{s.supporter}</span>
                <span className="text-primary tabular-nums shrink-0">{s.rateLabel}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
