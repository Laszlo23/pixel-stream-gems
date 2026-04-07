"use client";

import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  actionHref?: string;
  actionLabel?: string;
  children: ReactNode;
};

export function DiscoverRail({ title, subtitle, actionHref, actionLabel = "See all", children }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {actionHref && (
          <Link
            href={actionHref}
            className="text-xs font-medium text-primary inline-flex items-center gap-0.5 hover:gap-1 transition-all shrink-0"
          >
            {actionLabel}
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-thin snap-x snap-mandatory scroll-pl-4 -mx-1 px-1">
          {children}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
