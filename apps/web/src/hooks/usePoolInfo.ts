"use client";

/**
 * Placeholder for Uniswap v3 / Aerodrome pool TVL via `readContract` or an indexer.
 * Wire `NEXT_PUBLIC_POOL_LENS` or DeFiLlama when you pin pool addresses per creator.
 */
export function usePoolInfo(_poolAddress: `0x${string}` | undefined) {
  return { tvlUsd: null as string | null, loading: false };
}
