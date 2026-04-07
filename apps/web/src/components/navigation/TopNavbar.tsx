"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { LucideIcon } from "lucide-react";
import { Compass, MessageCircle, Radio, Search, ShoppingBag, Sparkles, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NavbarAuth } from "@/components/navigation/NavbarAuth";

const centerLinks: { href: string; label: string; icon: LucideIcon; match?: (p: string) => boolean }[] = [
  { href: "/discover", label: "Discover", icon: Compass, match: (p) => p === "/discover" },
  { href: "/live/maya", label: "Live Shows", icon: Radio, match: (p) => p.startsWith("/live") },
  { href: "/competitions", label: "Competitions", icon: Trophy },
  { href: "/marketplace", label: "Collectables", icon: ShoppingBag },
];

function linkActive(href: string, pathname: string, match?: (p: string) => boolean) {
  if (match) return match(pathname);
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopNavbar() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] h-14 lux-nav-shell">
      <div className="h-full container mx-auto px-3 sm:px-4 flex items-center gap-2 sm:gap-3">
        <Link href="/" className="flex items-center gap-2 shrink-0 group mr-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 border border-[rgba(255,43,85,0.35)] shadow-lux group-hover:shadow-lux-lg group-hover:-translate-y-0.5 bg-gradient-to-br from-[#ff2b55]/90 to-[#c4002f]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-gradient hidden sm:inline">Gems</span>
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 min-w-0" aria-label="Main">
          {centerLinks.map(({ href, label, icon: Icon, match }) => {
            const active = linkActive(href, pathname, match);
            return (
              <Tooltip key={href} delayDuration={200}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    aria-label={label}
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl h-10 w-10 shrink-0 transition-all duration-300",
                      active
                        ? "text-[hsl(var(--accent-glow))] bg-[rgba(255,43,85,0.12)] shadow-[inset_0_0_0_1px_rgba(255,43,85,0.35)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,43,85,0.06)] hover:shadow-[0_0_20px_rgba(255,43,85,0.1)]",
                    )}
                  >
                    <Icon className={cn("w-[18px] h-[18px] shrink-0", active && "text-[hsl(var(--accent-glow))]")} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={6}
                  className="z-[110] border border-[rgba(255,43,85,0.35)] bg-[#111111] text-foreground text-xs font-medium shadow-lux px-2.5 py-1.5"
                >
                  {label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <div className="flex-1 lg:hidden" />

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {searchOpen ? (
            <div className="hidden sm:flex items-center animate-in fade-in slide-in-from-right-2 duration-200">
              <Input
                placeholder="Creators, rooms…"
                className="h-9 w-36 md:w-48 rounded-xl bg-[#111111] border-[rgba(255,43,85,0.2)] text-sm focus-visible:ring-[rgba(255,43,85,0.45)]"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl text-muted-foreground hover:text-[hsl(var(--accent-glow))] hidden sm:flex"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={6}
                className="z-[110] border border-[rgba(255,43,85,0.35)] bg-[#111111] text-foreground text-xs font-medium shadow-lux px-2.5 py-1.5"
              >
                Search
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-[hsl(var(--accent-glow))]" asChild>
                <Link href="/messages" aria-label="Messages">
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={6}
              className="z-[110] border border-[rgba(255,43,85,0.35)] bg-[#111111] text-foreground text-xs font-medium shadow-lux px-2.5 py-1.5"
            >
              Messages
            </TooltipContent>
          </Tooltip>

          <NavbarAuth />
        </div>
      </div>
    </header>
  );
}
