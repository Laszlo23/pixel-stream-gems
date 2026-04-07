"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type ArenaPersisted,
  defaultArenaState,
  loadArena,
  saveArena,
} from "@/lib/arenaGamesStorage";

export type ArenaReward = {
  xp: number;
  gems?: number;
  label: string;
};

type ArenaRoomContextValue = {
  roomId: string;
  state: ArenaPersisted;
  /** Add XP / optional demo gem credits and persist */
  applyReward: (r: ArenaReward, patchStats?: (s: ArenaPersisted) => Partial<ArenaPersisted["stats"]>) => void;
  patchState: (fn: (prev: ArenaPersisted) => ArenaPersisted) => void;
  resetRoomProgress: () => void;
};

const ArenaRoomContext = createContext<ArenaRoomContextValue | null>(null);

export function ArenaRoomProvider({ roomId, children }: { roomId: string; children: ReactNode }) {
  const [state, setState] = useState<ArenaPersisted>(() => defaultArenaState());

  useEffect(() => {
    setState(loadArena(roomId));
  }, [roomId]);

  const patchState = useCallback(
    (fn: (prev: ArenaPersisted) => ArenaPersisted) => {
      setState((prev) => {
        const next = fn(prev);
        saveArena(roomId, next);
        return next;
      });
    },
    [roomId],
  );

  const applyReward = useCallback(
    (r: ArenaReward, patchStats?: (s: ArenaPersisted) => Partial<ArenaPersisted["stats"]>) => {
      patchState((prev) => {
        const statPatch = patchStats?.(prev) ?? {};
        return {
          ...prev,
          xp: prev.xp + r.xp,
          gemCredits: prev.gemCredits + (r.gems ?? 0),
          stats: { ...prev.stats, ...statPatch },
        };
      });
    },
    [patchState],
  );

  const resetRoomProgress = useCallback(() => {
    const fresh = defaultArenaState();
    saveArena(roomId, fresh);
    setState(fresh);
  }, [roomId]);

  const value = useMemo(
    () => ({
      roomId,
      state,
      applyReward,
      patchState,
      resetRoomProgress,
    }),
    [roomId, state, applyReward, patchState, resetRoomProgress],
  );

  return <ArenaRoomContext.Provider value={value}>{children}</ArenaRoomContext.Provider>;
}

export function useArenaRoom(): ArenaRoomContextValue {
  const ctx = useContext(ArenaRoomContext);
  if (!ctx) throw new Error("useArenaRoom must be used within ArenaRoomProvider");
  return ctx;
}
