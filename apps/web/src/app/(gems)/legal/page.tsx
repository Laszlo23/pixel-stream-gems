import Link from "next/link";
import { LEGAL_PAGES } from "@/lib/legalRoutes";

export default function LegalHubPage() {
  return (
    <main className="container mx-auto px-4 py-10 pb-16 max-w-2xl">
      <Link href="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6">
        ← Home
      </Link>
      <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Legal &amp; policies</h1>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Central index for Gems demo documents. Each page is a placeholder until you replace it with jurisdiction-specific,
        counsel-reviewed text.
      </p>
      <ul className="mt-8 space-y-3">
        {LEGAL_PAGES.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(255,43,85,0.15)] bg-[#111111]/50 px-4 py-3 text-sm text-foreground hover:border-[rgba(255,43,85,0.35)] hover:bg-[rgba(255,43,85,0.06)] transition-colors"
            >
              <span className="font-medium">{label}</span>
              <span className="text-xs text-[hsl(var(--accent-glow))]">Open →</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <Link href="/safety" className="text-[hsl(var(--accent-glow))] hover:underline font-medium">
          Safety &amp; community →
        </Link>
      </p>
    </main>
  );
}
