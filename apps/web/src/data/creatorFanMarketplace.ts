/**
 * Per-creator fan shop: digital collectibles (e.g. recorded shows) and
 * redeemable NFTs that unlock an agreed IRL / private experience window.
 * On-chain listing wiring comes later; this layer drives UX + copy.
 */

export type ExperienceTier =
  | "meet_greet"
  | "dinner_social"
  | "extended_evening"
  | "vip_extended";

export const EXPERIENCE_TIER_LABEL: Record<ExperienceTier, string> = {
  meet_greet: "Meet & greet",
  dinner_social: "Dinner or social outing",
  extended_evening: "Extended evening",
  vip_extended: "VIP extended",
};

export const EXPERIENCE_TIER_DESCRIPTION: Record<ExperienceTier, string> = {
  meet_greet: "Short, public or semi-public hello — coffee, convention floor, or similar.",
  dinner_social: "A seated meal or equivalent social time in a public venue you both agree on.",
  extended_evening: "A longer private window (e.g. dinner + event) within a single day — scope in the redemption brief.",
  vip_extended: "The longest tier — often an overnight or multi-block window. Exact boundaries are set in the creator’s brief after mint.",
};

export interface CreatorDigitalListing {
  id: string;
  title: string;
  subtitle?: string;
  priceLabel: string;
  description: string;
  /** e.g. "Replay + stems", "4K download" */
  deliverable: string;
}

export interface CreatorRedeemableListing {
  id: string;
  title: string;
  tier: ExperienceTier;
  priceLabel: string;
  /** Human-readable time box, e.g. "About 2–3 hours" */
  durationLabel: string;
  /** Bullet list of what this tier typically covers (creator fills in app later). */
  included: string[];
  /** In-app + off-app steps so buyers know the flow. */
  redemptionSteps: string[];
  /** Creator-specific constraints (dress code, cities, languages, etc.). */
  notesForBuyer?: string;
}

export interface CreatorFanShop {
  creatorId: string;
  headline: string;
  digital: CreatorDigitalListing[];
  redeemable: CreatorRedeemableListing[];
}

const SHOPS: Record<string, CreatorFanShop> = {
  maya: {
    creatorId: "maya",
    headline: "Recorded sets, stems, and a small number of private listening / social windows.",
    digital: [
      {
        id: "maya-d1",
        title: "Full set replay — “North Star” session",
        subtitle: "Multi-cam + board mix",
        priceLabel: "0.08 ETH",
        description:
          "The full archived stream with chat overlay optional. Holders can rewatch anytime; resale transfers the unlock.",
        deliverable: "HD replay link + download for 90 days",
      },
      {
        id: "maya-d2",
        title: "Stem pack · Acoustic Sunday",
        priceLabel: "0.15 ETH",
        description: "DAW stems and MIDI for the live arrangement — license for personal use & remixes per creator terms.",
        deliverable: "ZIP + on-chain license hash",
      },
    ],
    redeemable: [
      {
        id: "maya-r1",
        title: "Post-show dinner (restaurant)",
        tier: "dinner_social",
        priceLabel: "0.45 ETH",
        durationLabel: "About 2–3 hours",
        included: [
          "One meal in a public venue in Berlin or Amsterdam (or nearby by mutual agreement).",
          "Scheduling via Gems redemption inbox within 60 days of mint.",
          "You cover your own travel unless otherwise agreed in writing.",
        ],
        redemptionSteps: [
          "Mint or buy the NFT on secondary.",
          "Open Redeem in Gems — propose 3 date windows.",
          "Creator confirms one window; you receive a calendar hold + venue notes.",
          "Meet at the agreed time. NFT marks as redeemed on-chain after both sides confirm.",
        ],
        notesForBuyer: "Alcohol / dietary needs: share in the redemption form. No private residence meets for this tier.",
      },
      {
        id: "maya-r2",
        title: "Extended evening — city social",
        tier: "extended_evening",
        priceLabel: "1.2 ETH",
        durationLabel: "Up to ~6 hours in one calendar day",
        included: [
          "Dinner plus a second social block (show, walk, lounge) in the same metro.",
          "Coordination through Gems only until the handoff is complete.",
        ],
        redemptionSteps: [
          "Redeem within 90 days of mint.",
          "Complete identity & safety checklist (both parties).",
          "Agree city + rough itinerary outline; creator sends final brief.",
          "After the meet, both confirm completion to close the redemption record.",
        ],
        notesForBuyer: "Scope stays social in public or semi-public spaces unless you both sign an addendum the creator provides.",
      },
      {
        id: "maya-r3",
        title: "VIP extended window",
        tier: "vip_extended",
        priceLabel: "3.5 ETH",
        durationLabel: "Creator-defined multi-hour or overnight window",
        included: [
          "The longest tier: exact start/end and house rules are only in the private brief after purchase.",
          "Includes a planning call and written itinerary summary.",
        ],
        redemptionSteps: [
          "Mint — you’ll see a mandatory policy checklist (age, consent, local law).",
          "Creator sends a private brief; you accept or decline within 7 days.",
          "Escrow-style messaging in Gems until both confirm the plan.",
          "After the window, mutual confirmation closes the NFT state.",
        ],
        notesForBuyer:
          "This tier is for consenting adults only. Anything beyond what local law allows is off-platform and not facilitated by Gems.",
      },
    ],
  },
  pixelpanda: {
    creatorId: "pixelpanda",
    headline: "Digital drops for retro runs — no IRL redemption on this shop (yet).",
    digital: [
      {
        id: "panda-d1",
        title: "PB marathon highlight reel NFT",
        priceLabel: "0.04 ETH",
        description: "Best moments from the last charity marathon with commentary track.",
        deliverable: "1080p MP4 + badge",
      },
      {
        id: "panda-d2",
        title: "Viewer race priority pass (season)",
        priceLabel: "0.12 ETH",
        description: "Jump three slots in the queue for any viewer race this season — tied to your wallet.",
        deliverable: "On-chain pass + Discord role",
      },
    ],
    redeemable: [],
  },
  chefvibes: {
    creatorId: "chefvibes",
    headline: "Cook-along recordings plus a few in-person table experiences.",
    digital: [
      {
        id: "chef-d1",
        title: "Brunch stream — full recipe pack",
        priceLabel: "0.05 ETH",
        description: "Shopping list, timings, and the chat Q&A transcript.",
        deliverable: "PDF + video replay",
      },
    ],
    redeemable: [
      {
        id: "chef-r1",
        title: "Private cook-along (your kitchen or studio)",
        tier: "dinner_social",
        priceLabel: "1.5 ETH",
        durationLabel: "About 3 hours on-site",
        included: [
          "Creator travels within agreed metro (travel surcharge may apply).",
          "You provide ingredients from a shared list; we cook and dine together.",
        ],
        redemptionSteps: [
          "Redeem with your city + kitchen photos (safety).",
          "Pick dates; creator confirms.",
          "Deposit / waiver per creator policy.",
          "Session day — NFT marks redeemed after completion.",
        ],
        notesForBuyer: "Hosts with pet allergies: declare upfront. Max guest count: 4 unless upgraded.",
      },
    ],
  },
};

export function getCreatorFanShop(creatorId: string | undefined): CreatorFanShop | null {
  if (!creatorId) return null;
  return SHOPS[creatorId] ?? null;
}

export function getCreatorsWithFanShops(): { creatorId: string; headline: string; hasRedeemable: boolean }[] {
  return Object.values(SHOPS).map((s) => ({
    creatorId: s.creatorId,
    headline: s.headline,
    hasRedeemable: s.redeemable.length > 0,
  }));
}
