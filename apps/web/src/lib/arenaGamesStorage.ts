export const ARENA_STORAGE_VERSION = 1 as const;

export type ArenaGameStats = {
  triviaCorrect: number;
  triviaWrong: number;
  wheelSpins: number;
  battlesWon: number;
  battlesLost: number;
  predictionsWon: number;
  predictionsLost: number;
  numberGameWins: number;
  numberGamePlays: number;
  messagesSent: number;
  tipsSent: number;
  reactionsSent: number;
};

export type ArenaPersisted = {
  version: typeof ARENA_STORAGE_VERSION;
  xp: number;
  /** Demo “$GEM” credits from wheel — not on-chain */
  gemCredits: number;
  rallyA: number;
  rallyB: number;
  stats: ArenaGameStats;
};

const defaultStats = (): ArenaGameStats => ({
  triviaCorrect: 0,
  triviaWrong: 0,
  wheelSpins: 0,
  battlesWon: 0,
  battlesLost: 0,
  predictionsWon: 0,
  predictionsLost: 0,
  numberGameWins: 0,
  numberGamePlays: 0,
  messagesSent: 0,
  tipsSent: 0,
  reactionsSent: 0,
});

export function defaultArenaState(): ArenaPersisted {
  return {
    version: ARENA_STORAGE_VERSION,
    xp: 0,
    gemCredits: 0,
    rallyA: 42,
    rallyB: 38,
    stats: defaultStats(),
  };
}

function storageKey(roomId: string): string {
  return `gems-arena:${roomId}`;
}

export function loadArena(roomId: string): ArenaPersisted {
  if (typeof window === "undefined") return defaultArenaState();
  try {
    const raw = localStorage.getItem(storageKey(roomId));
    if (!raw) return defaultArenaState();
    const j = JSON.parse(raw) as Partial<ArenaPersisted>;
    if (j.version !== ARENA_STORAGE_VERSION) return defaultArenaState();
    const base = defaultArenaState();
    return {
      ...base,
      ...j,
      stats: { ...base.stats, ...(j.stats ?? {}) },
    };
  } catch {
    return defaultArenaState();
  }
}

export function saveArena(roomId: string, state: ArenaPersisted): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(roomId), JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}
