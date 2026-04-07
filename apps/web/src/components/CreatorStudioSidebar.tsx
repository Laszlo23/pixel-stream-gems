"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Radio,
  SlidersHorizontal,
  Users,
  Trophy,
  Layers,
  Wallet,
  BarChart3,
  Settings,
  Home,
  UserRound,
} from "lucide-react";

const links: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/creator", label: "Dashboard", icon: Home },
  { href: "/creator/profile", label: "Profile", icon: UserRound },
  { href: "/creator/go-live", label: "Go Live", icon: Radio },
  { href: "/creator/stream-manager", label: "Stream tools", icon: SlidersHorizontal },
  { href: "/creator/fans", label: "Fans", icon: Users },
  { href: "/creator/nft", label: "Collectables", icon: Layers },
  { href: "/creator/competitions", label: "Rewards", icon: Trophy },
  { href: "/creator/earnings", label: "Earnings", icon: Wallet },
  { href: "/creator/analytics", label: "Growth Tools", icon: BarChart3 },
  { href: "/creator/settings", label: "Settings", icon: Settings },
];

export function CreatorStudioSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex w-56 shrink-0 flex-col border-r border-border/50 bg-[#0a0a0a]/95 backdrop-blur-xl",
        "sticky top-14 self-start max-h-[calc(100dvh-3.5rem)] overflow-y-auto",
      )}
    >
      <div className="p-4 border-b border-border/50">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Creator</p>
        <p className="text-[11px] text-muted-foreground mt-1 leading-snug">Your backstage — fans don&apos;t see this menu.</p>
      </div>
      <nav className="flex flex-col gap-0.5 p-2 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/creator" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all duration-300",
                active
                  ? "bg-[hsl(var(--primary)/0.14)] text-foreground font-medium shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/35 hover:shadow-[0_0_12px_hsl(var(--primary)/0.06)]",
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active && "text-[hsl(var(--accent-glow))]")} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2 rounded-xl border border-[hsl(var(--gold)/0.2)] bg-[hsl(var(--gold)/0.05)] px-3 py-2">
          <LayoutDashboard className="w-4 h-4 text-[hsl(var(--gold))]" />
          <span className="text-[10px] text-muted-foreground leading-tight">Creator coin &amp; support pools: Earnings &amp; Settings.</span>
        </div>
      </div>
    </aside>
  );
}
