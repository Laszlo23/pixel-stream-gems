/**
 * Gems onboarding & referral microcopy — brand-forward, non-explicit.
 * Have counsel / platform policy review before production; adjust tone for regional rules.
 */

export const fanOnboarding = {
  title: "Your front-row pass",
  steps: [
    {
      headline: "Welcome to the velvet rope",
      body: "Gems is where live energy meets collectables. Sign in, tip creators, and own moments — all on-chain when you choose.",
    },
    {
      headline: "Stay smooth, stay respectful",
      body: "Creators set the tone. Consent and boundaries matter here. Report anything off — we keep the room hot, not hostile.",
    },
    {
      headline: "Wallet = your backstage pass",
      body: "Your wallet unlocks tips, streams, and drops. No wallet yet? We’ll help you create one — it takes a minute.",
    },
    {
      headline: "Make it yours",
      body: "Pick a display vibe for chat and leaderboards. You can change this anytime in settings.",
    },
    {
      headline: "You’re in",
      body: "You’ve earned starter sparkle. Explore live rooms, follow a creator, and share your link to invite friends.",
      rewardLabel: "Starter sparkle",
    },
  ],
  displayNamePlaceholder: "How should we call you?",
  ctaNext: "Continue",
  ctaFinish: "Enter Gems",
  skipHint: "You can revisit tips anytime in Safety & trust.",
} as const;

export const creatorOnboarding = {
  title: "Creator spotlight",
  steps: [
    {
      headline: "Own your stage",
      body: "Studio tools help you schedule, go live, and connect with fans who show up for you.",
    },
    {
      headline: "Profile that pulls focus",
      body: "Strong bios and schedules convert curiosity into regulars. Polish your public page first.",
    },
    {
      headline: "Trust, verified",
      body: "Verification is a quick video check with our team — it protects you and your audience.",
    },
    {
      headline: "Go live with confidence",
      body: "Test audio, lighting, and payouts before you promote a show. Small rehearsals, big nights.",
    },
    {
      headline: "You’re set to shine",
      body: "You’ve unlocked studio flair. Head to your dashboard when you’re ready to rehearse or publish.",
      rewardLabel: "Studio flair",
    },
  ],
  ctaNext: "Next",
  ctaFinish: "Open studio",
} as const;

export const referralCopy = {
  toastTitle: "Invited by a VIP",
  toastDescription: (code: string) => `You joined through ${code}. Here’s a little extra sparkle.`,
  shareLabel: "Your invite link",
  shareHint:
    "Friends who use your link can sign once to record the referral on the Gems API (when NEXT_PUBLIC_API_URL is set). You both earn server XP on first attribution.",
  copyButton: "Copy link",
  copied: "Copied",
  referralSyncedNew: "Referral saved — bonus XP applied on the server.",
  referralSyncedExisting: "Invite was already linked to your wallet.",
} as const;
