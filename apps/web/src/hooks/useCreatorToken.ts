"use client";

import { useReadContract } from "wagmi";
import type { Address } from "viem";
import { erc20Abi } from "viem";

export function useCreatorTokenBalance(tokenAddress: Address | undefined, wallet: Address | undefined) {
  return useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: wallet ? [wallet] : undefined,
    query: { enabled: Boolean(tokenAddress && wallet) },
  });
}
