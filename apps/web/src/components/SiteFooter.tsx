import Link from "next/link";
import { DeveloperCredit } from "@/components/DeveloperCredit";
import { GemsLogoMark } from "@/components/brand/GemsLogoMark";
import { BuiltOnStrip } from "@/components/brand/BuiltOnStrip";

const creatorLinks = [
  { href: "/creator/profile", label: "Create creator profile" },
  { href: "/creator", label: "Creator studio" },
] as const;

const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/imprint", label: "Imprint" },
  { href: "/legal/dmca", label: "DMCA / Copyright" },
  { href: "/legal/acceptable-use", label: "Acceptable use" },
] as const;

const trustLinks = [{ href: "/safety", label: "Safety & community" }] as const;

const productLinks = [
  { href: "/roadmap", label: "Roadmap" },
  { href: "/technical", label: "Technical overview" },
] as const;

const SOURCE_REPO_DEFAULT = "https://github.com/Laszlo23/pixel-stream-gems";

export function SiteFooter() {
  const repoUrl = process.env.NEXT_PUBLIC_SOURCE_REPO_URL?.trim() || SOURCE_REPO_DEFAULT;

  return (
    <footer className="mt-auto border-t border-[rgba(255,43,85,0.12)] bg-[#050505]/95 backdrop-blur-xl">
      <div className="app-shell px-4 py-10 pb-[calc(2.5rem+env(safe-area-inset-bottom))] lg:pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <GemsLogoMark className="w-5 h-5 rounded-md" />
              <span className="font-display font-bold text-sm text-gradient">Gems</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[220px]">
              Live shows, creator coins, and collectables. Creator onboarding lives here — not in the main nav.
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
              <Link
                href="/sign-in"
                className="text-[11px] text-[hsl(var(--accent-glow))] hover:underline font-medium"
              >
                Join free
              </Link>
              <Link href="/onboarding/fan" className="text-[11px] text-muted-foreground hover:text-foreground">
                Fan onboarding
              </Link>
              <Link href="/onboarding/creator" className="text-[11px] text-muted-foreground hover:text-foreground">
                Creator onboarding
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Creators</p>
            <ul className="space-y-2">
              {creatorLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Product</p>
            <ul className="space-y-2">
              {productLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Source code
                  <span className="text-[10px] opacity-70" aria-hidden>
                    ↗
                  </span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Legal</p>
            <ul className="space-y-2">
              <li>
                <Link href="/legal" className="text-xs text-[hsl(var(--accent-glow))] hover:underline font-medium transition-colors">
                  Legal overview
                </Link>
              </li>
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Trust</p>
            <ul className="space-y-2">
              {trustLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[rgba(255,43,85,0.1)]">
          <BuiltOnStrip compact className="justify-center" />
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(255,43,85,0.1)]">
          <DeveloperCredit />
        </div>

        <div className="mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} Gems. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground/80 text-center sm:text-right max-w-md">
            Gems is a demo product surface — replace legal pages with counsel-reviewed documents before production.
          </p>
        </div>
      </div>
    </footer>
  );
}
