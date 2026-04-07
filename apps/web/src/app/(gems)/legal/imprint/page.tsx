import { LegalDocShell } from "@/components/legal/LegalDocShell";
import { SITE_DEVELOPER } from "@/lib/siteDeveloper";

export default function ImprintPage() {
  return (
    <LegalDocShell title="Imprint (Legal notice)">
      <p>
        <strong>Required for many EU jurisdictions.</strong> Add the legally mandated business details: company name, address,
        registration number, VAT ID, managing directors, and contact email.
      </p>
      <p>
        <strong>Dispute resolution.</strong> If applicable, include information on consumer arbitration bodies and EU ODR
        platform references.
      </p>
      <p>
        <strong>Technical contact (demo).</strong> This build lists an independent developer for attribution only — not a
        substitute for a registered business imprint:{" "}
        <a href={SITE_DEVELOPER.farcasterUrl} className="text-[hsl(var(--accent-glow))] hover:underline" target="_blank" rel="noopener noreferrer">
          Farcaster @{SITE_DEVELOPER.farcasterHandle}
        </a>
        ,{" "}
        <a href={SITE_DEVELOPER.xUrl} className="text-[hsl(var(--accent-glow))] hover:underline" target="_blank" rel="noopener noreferrer">
          X @{SITE_DEVELOPER.xHandle}
        </a>
        , on-chain:{" "}
        <a
          href={SITE_DEVELOPER.walletExplorerUrl}
          className="text-[hsl(var(--accent-glow))] hover:underline font-mono text-xs break-all"
          target="_blank"
          rel="noopener noreferrer"
        >
          {SITE_DEVELOPER.wallet}
        </a>
        .
      </p>
    </LegalDocShell>
  );
}
