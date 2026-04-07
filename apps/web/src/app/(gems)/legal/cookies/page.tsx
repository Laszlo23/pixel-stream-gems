import { LegalDocShell } from "@/components/legal/LegalDocShell";

export default function CookiesPage() {
  return (
    <LegalDocShell title="Cookie Policy">
      <p>
        <strong>Summary.</strong> Explain which cookies and similar technologies you use (strictly necessary, analytics,
        personalization) and how users can manage consent.
      </p>
      <p>
        If you embed third-party wallets, chat, or analytics, list them here and link to their policies. Align this page with
        your cookie banner / consent tool.
      </p>
    </LegalDocShell>
  );
}
