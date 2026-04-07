"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, ShoppingBag, Compass, UserRound, Video, Heart } from "lucide-react";

const tabs: { href: string; label: string; icon: typeof Home; match?: (p: string) => boolean }[] = [
  { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  { href: "/live/maya", label: "Live", icon: Video, match: (p) => p.startsWith("/live") },
  { href: "/discover", label: "Shows", icon: Compass, match: (p) => p === "/discover" },
  { href: "/marketplace", label: "Collectables", icon: ShoppingBag },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function activeTab(pathname: string, href: string, match?: (p: string) => boolean) {
  if (match) return match(pathname);
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[90] border-t border-[rgba(255,43,85,0.12)] bg-[#070707]/95 backdrop-blur-2xl pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-14 px-1">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const on = activeTab(pathname, href, match);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[3.25rem] py-1 rounded-xl transition-all duration-300",
                on ? "text-[hsl(var(--accent-glow))] drop-shadow-[0_0_10px_rgba(255,43,85,0.45)]" : "text-muted-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileFanFab() {
  const pathname = usePathname();
  if (pathname.startsWith("/creator")) {
    return null;
  }

  return (
    <Link
      href="/live/maya"
      className="lg:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom)+12px)] right-4 z-[95] flex h-14 px-5 items-center justify-center gap-2 rounded-2xl text-primary-foreground border border-white/15 shadow-lux-lg active:scale-95 transition-all duration-300 text-sm font-semibold hover:shadow-lux hover:-translate-y-0.5"
      style={{ background: "var(--lux-gradient-cta)" }}
      aria-label="Send love"
    >
      <Heart className="w-5 h-5 fill-current opacity-95" />
      Send love
    </Link>
  );
}
