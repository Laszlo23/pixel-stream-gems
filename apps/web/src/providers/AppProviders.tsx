"use client";

import type { ReactNode } from "react";
import type { State } from "wagmi";
import { Web3Provider } from "@/providers/Web3Provider";
import { PrivyWalletAutoConnect } from "@/components/PrivyWalletAutoConnect";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export function AppProviders({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State | undefined;
}) {
  return (
    <Web3Provider initialState={initialState}>
      <PrivyWalletAutoConnect />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </Web3Provider>
  );
}
