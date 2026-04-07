"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LEGAL_PAGES } from "@/lib/legalRoutes";
import { cn } from "@/lib/utils";

export function LegalDocShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <main className="container mx-auto px-4 py-10 pb-16 max-w-2xl">
      <Link href="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
        ← Home
      </Link>

      <nav
        aria-label="Legal documents"
        className="flex flex-wrap gap-2 p-3 rounded-2xl border border-[rgba(255,43,85,0.15)] bg-[#111111]/60 mb-8"
      >
        <Link
          href="/legal"
          className={cn(
            "text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors",
            pathname === "/legal"
              ? "bg-[rgba(255,43,85,0.15)] text-[hsl(var(--accent-glow))]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Overview
        </Link>
        {LEGAL_PAGES.map(({ href, short }) => {
          const on = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors",
                on
                  ? "bg-[rgba(255,43,85,0.15)] text-[hsl(var(--accent-glow))]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {short}
            </Link>
          );
        })}
        <Link
          href="/safety"
          className={cn(
            "text-[11px] font-medium px-2.5 py-1 rounded-lg transition-colors",
            pathname === "/safety"
              ? "bg-[rgba(255,43,85,0.15)] text-[hsl(var(--accent-glow))]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Safety
        </Link>
      </nav>

      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      <p className="text-xs text-muted-foreground mt-2">
        Last updated: April 2026 · Demo placeholders — not legal advice. Have counsel review before production.
      </p>
      <div className="mt-8 text-sm text-muted-foreground space-y-4 leading-relaxed [&_strong]:text-foreground">{children}</div>
    </main>
  );
}
