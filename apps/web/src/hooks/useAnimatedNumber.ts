import { useEffect, useState } from "react";

/** Ease-out cubic from 0 → target when `target` or `durationMs` changes. */
export function useAnimatedNumber(target: number, durationMs = 1400): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
