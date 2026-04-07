"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

/**
 * Privy validates `NEXT_PUBLIC_PRIVY_APP_ID` at init and pulls optional peers; load wallet providers
 * only on the client so `next build` static prerender does not execute them.
 */
const AppProviders = dynamic(() => import("@/providers/AppProviders").then((m) => m.AppProviders), {
  ssr: false,
});

export function Providers({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
