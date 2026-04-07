"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Compass,
  Film,
  Home,
  MessageCircle,
  Radio,
  Settings,
  ShoppingBag,
  Trophy,
  UserRound,
} from "lucide-react";

const mainLinks: { href: string; label: string; icon: LucideIcon; match?: (p: string) => boolean }[] = [
  { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { href: "/discover", label: "Discover", icon: Compass, match: (p) => p === "/discover" },
  { href: "/live/maya", label: "Live Shows", icon: Radio, match: (p) => p.startsWith("/live") },
  { href: "/competitions", label: "Competitions", icon: Trophy },
  { href: "/leaderboards", label: "Leaderboards", icon: BarChart3 },
  { href: "/marketplace", label: "Collectables", icon: ShoppingBag },
  { href: "/clips", label: "Clips", icon: Film },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function navActive(href: string, pathname: string, match?: (p: string) => boolean) {
  if (match) return match(pathname);
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FanSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex w-56 shrink-0 flex-col border-r border-[rgba(255,43,85,0.1)] bg-[#070707]/95 backdrop-blur-2xl",
        "sticky top-14 self-start max-h-[calc(100dvh-3.5rem)] overflow-y-auto",
      )}
    >
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Browse</p>
        {mainLinks.map(({ href, label, icon: Icon, match }) => {
          const active = navActive(href, pathname, match);
          return (
            <Link
              key={href}
              href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-300",
                  active
                    ? "bg-[rgba(255,43,85,0.12)] text-foreground font-semibold shadow-[inset_0_0_0_1px_rgba(255,43,85,0.28)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,43,85,0.06)] hover:shadow-[0_0_16px_rgba(255,43,85,0.08)]",
                )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active && "text-[hsl(var(--accent-glow))]")} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-[rgba(255,43,85,0.1)]">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-300",
            pathname.startsWith("/settings")
              ? "text-[hsl(var(--accent-glow))] bg-[rgba(255,43,85,0.1)]"
              : "text-muted-foreground hover:bg-[rgba(255,43,85,0.05)]",
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>
      </div>
    </aside>
  );
}
