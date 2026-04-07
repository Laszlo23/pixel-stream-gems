import { LegalDocShell } from "@/components/legal/LegalDocShell";

export default function PrivacyPage() {
  return (
    <LegalDocShell title="Privacy Policy">
      <p>
        <strong>Summary.</strong> This placeholder describes how you intend to handle personal data. Replace with a GDPR /
        CCPA-aligned policy that matches your actual data flows (wallets, analytics, video, support).
      </p>
      <p>
        Typical topics: categories of data collected, purposes, legal bases, retention, subprocessors, international
        transfers, and user rights (access, deletion, portability).
      </p>
      <p>
        <strong>Wallet addresses</strong> may be treated as personal data in some regions — disclose indexing, RPC providers,
        and any linking to off-chain identity.
      </p>
    </LegalDocShell>
  );
}
