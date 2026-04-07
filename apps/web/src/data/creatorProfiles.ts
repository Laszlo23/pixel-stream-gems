import { STREAMERS, type StreamerMeta } from "./streamers";

export interface CreatorAnnouncement {
  id: string;
  title: string;
  body: string;
  date: string;
  pinned?: boolean;
}

export interface CreatorScheduleSlot {
  id: string;
  title: string;
  weekday: string;
  timeUtc: string;
  note?: string;
}

export interface CreatorPost {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
}

export interface CreatorShow {
  id: string;
  name: string;
  date: string;
  venue?: string;
  url?: string;
  kind: "stream" | "public_event" | "hybrid";
}

export interface CreatorSocials {
  website?: string;
  x?: string;
  instagram?: string;
  youtube?: string;
  farcaster?: string;
  discord?: string;
  github?: string;
  soundcloud?: string;
}

export interface CreatorContracts {
  creatorToken: `0x${string}`;
  nftTickets: `0x${string}`;
  nftMoments: `0x${string}`;
  nftPerks: `0x${string}`;
}

/** Public appearances (cons, panels, shows). Redeemable private experiences are listed separately in the fan marketplace. */
export interface CreatorPublicMeetups {
  openToInPerson: boolean;
  headline?: string;
  details?: string;
  /** Regions where they do public events (not precise addresses). */
  regions?: string[];
}

export interface CreatorProfileDetails {
  handle: string;
  tagline: string;
  bio: string;
  contracts: CreatorContracts;
  announcements: CreatorAnnouncement[];
  schedule: CreatorScheduleSlot[];
  posts: CreatorPost[];
  shows: CreatorShow[];
  socials: CreatorSocials;
  meetups: CreatorPublicMeetups;
}

export type CreatorPublicView = StreamerMeta & CreatorProfileDetails;

function addr(seed: string): `0x${string}` {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hex = (n: number) => n.toString(16).padStart(8, "0");
  const part = hex(h) + hex(h ^ 0x9e3779b9) + hex(h ^ 0xdeadbeef) + hex(h ^ 0xcafebabe) + hex(h ^ 0xabcdef01);
  return (`0x${part.slice(0, 40)}`) as `0x${string}`;
}

const PROFILES: Record<string, CreatorProfileDetails> = {
  maya: {
    handle: "maya",
    tagline: "Live vocals, analog synths, and late-night listening sessions.",
    bio: "I stream stripped-back sets and talk through production choices. Holders of $MAYA get early track previews, vote on setlists, and access private listening rooms.",
    contracts: {
      creatorToken: addr("maya-token"),
      nftTickets: addr("maya-tix"),
      nftMoments: addr("maya-mom"),
      nftPerks: addr("maya-perk"),
    },
    announcements: [
      {
        id: "a1",
        title: "Acoustic Sunday — new arrangement drop",
        body: "This weekend I'm debuting a rework of 'North Star'. NFT ticket holders get the stems in their wallets after the show.",
        date: "2026-04-02",
        pinned: true,
      },
      {
        id: "a2",
        title: "Superfluid flow tiers updated",
        body: "You can now stream support at $0.05/min or $1/hr — check the Live Support Meter during sets.",
        date: "2026-03-28",
      },
    ],
    schedule: [
      { id: "s1", title: "Main set + Q&A", weekday: "Friday", timeUtc: "21:00 UTC" },
      { id: "s2", title: "Chill / requests", weekday: "Sunday", timeUtc: "19:00 UTC" },
      { id: "s3", title: "Studio build stream", weekday: "Wednesday", timeUtc: "18:00 UTC", note: "Coding synth patches live" },
    ],
    posts: [
      {
        id: "p1",
        title: "Why I moved my community on-chain",
        excerpt: "Tokens aren't hype — they're a fair way to reward people who show up early.",
        body: "Fair launch, transparent pools paired with BTC-pegged assets, and perks that actually unlock things. That's the whole thesis.",
        date: "2026-03-10",
      },
      {
        id: "p2",
        title: "Gear I use every stream",
        excerpt: "A minimal desk setup focused on sound over lights.",
        body: "Octatrack, one mono synth, and a lot of reverb. I'll drop a full list for perk NFT holders next week.",
        date: "2026-02-22",
      },
    ],
    shows: [
      {
        id: "sh1",
        name: "Gems Live: Spring Session",
        date: "2026-04-12T21:00:00Z",
        venue: "Gems (stream)",
        kind: "stream",
      },
      {
        id: "sh2",
        name: "Indie Web Meetup — acoustic mini-set",
        date: "2026-04-26T17:00:00Z",
        venue: "Public venue TBA — Berlin",
        kind: "public_event",
      },
    ],
    socials: {
      website: "https://example.com/maya",
      x: "https://x.com/maya_music",
      instagram: "https://instagram.com/maya",
      youtube: "https://youtube.com/@maya",
      farcaster: "https://warpcast.com/maya",
    },
    meetups: {
      openToInPerson: true,
      headline: "Public events & panels",
      details: "I occasionally play short acoustic sets at indie / web3 meetups. Schedule is announced here first; no DMs for private bookings through Gems.",
      regions: ["Berlin", "Amsterdam"],
    },
  },
  pixelpanda: {
    handle: "pixelpanda",
    tagline: "Retro speedruns with a cozy chat.",
    bio: "Speedrunning 90s platformers and RPGs. $PANDA holders vote on categories and get priority when we run viewer races.",
    contracts: {
      creatorToken: addr("panda-token"),
      nftTickets: addr("panda-tix"),
      nftMoments: addr("panda-mom"),
      nftPerks: addr("panda-perk"),
    },
    announcements: [
      {
        id: "a1",
        title: "Charity marathon weekend",
        body: "All Superfluid flows this weekend go to a games-for-youth nonprofit — receipts posted Monday.",
        date: "2026-04-01",
        pinned: true,
      },
    ],
    schedule: [
      { id: "s1", title: "Main runs", weekday: "Tuesday", timeUtc: "23:00 UTC" },
      { id: "s2", title: "Casual / just chatting", weekday: "Saturday", timeUtc: "16:00 UTC" },
    ],
    posts: [
      {
        id: "p1",
        title: "How I picked my first speedgame",
        excerpt: "Spoiler: it was the one I already loved.",
        body: "Pick something you'll reset a thousand times without hating it. Everything else follows.",
        date: "2026-03-15",
      },
    ],
    shows: [
      {
        id: "sh1",
        name: "Retro Relay — team relay stream",
        date: "2026-04-08T22:00:00Z",
        kind: "stream",
      },
    ],
    socials: {
      x: "https://x.com/pixelpanda",
      youtube: "https://youtube.com/@pixelpanda",
      discord: "https://discord.gg/example",
    },
    meetups: {
      openToInPerson: false,
      headline: "Online-first",
      details: "I don't run public IRL events right now — catch collabs on stream.",
    },
  },
  beatsmaster: {
    handle: "beatsmaster",
    tagline: "House & breaks from the home studio.",
    bio: "DJ sets, track breakdowns, and sample pack drops for $BEATS holders.",
    contracts: {
      creatorToken: addr("beats-token"),
      nftTickets: addr("beats-tix"),
      nftMoments: addr("beats-mom"),
      nftPerks: addr("beats-perk"),
    },
    announcements: [],
    schedule: [
      { id: "s1", title: "Friday night live", weekday: "Friday", timeUtc: "22:00 UTC" },
    ],
    posts: [
      {
        id: "p1",
        title: "My first on-chain sample pack",
        excerpt: "Perk NFTs unlock download + license.",
        body: "Everything is hashed and linked to the perk contract — resale transfers the license.",
        date: "2026-03-01",
      },
    ],
    shows: [{ id: "sh1", name: "Warehouse stream (virtual)", date: "2026-04-20T20:00:00Z", kind: "stream" }],
    socials: { x: "https://x.com/beatsmaster", soundcloud: "https://soundcloud.com/beatsmaster" },
    meetups: { openToInPerson: false },
  },
  codewizard: {
    handle: "codewizard",
    tagline: "Ship small tools, live.",
    bio: "Building in public on Base. $WIZ is for folks who want early access to repos and office hours.",
    contracts: {
      creatorToken: addr("wiz-token"),
      nftTickets: addr("wiz-tix"),
      nftMoments: addr("wiz-mom"),
      nftPerks: addr("wiz-perk"),
    },
    announcements: [],
    schedule: [{ id: "s1", title: "Build stream", weekday: "Thursday", timeUtc: "17:00 UTC" }],
    posts: [],
    shows: [],
    socials: { website: "https://example.dev/wiz", x: "https://x.com/codewizard", github: "https://github.com/codewizard" },
    meetups: {
      openToInPerson: true,
      headline: "Conference talks",
      details: "I speak at dev conferences — no private 1:1 IRL bookings via Gems.",
      regions: ["Remote", "EU"],
    },
  },
  chefvibes: {
    handle: "chefvibes",
    tagline: "Cook-along streams with shopping lists on-chain.",
    bio: "$CHEF holders vote on cuisines and get ingredient NFTs that double as coupons with partners (demo).",
    contracts: {
      creatorToken: addr("chef-token"),
      nftTickets: addr("chef-tix"),
      nftMoments: addr("chef-mom"),
      nftPerks: addr("chef-perk"),
    },
    announcements: [],
    schedule: [{ id: "s1", title: "Sunday brunch cook", weekday: "Sunday", timeUtc: "15:00 UTC" }],
    posts: [],
    shows: [],
    socials: { instagram: "https://instagram.com/chefvibes", youtube: "https://youtube.com/@chefvibes" },
    meetups: { openToInPerson: false },
  },
  artflow: {
    handle: "artflow",
    tagline: "Digital painting + generative sketches.",
    bio: "$FLOW for collectors who want timelapse NFTs and workshop access.",
    contracts: {
      creatorToken: addr("flow-token"),
      nftTickets: addr("flow-tix"),
      nftMoments: addr("flow-mom"),
      nftPerks: addr("flow-perk"),
    },
    announcements: [],
    schedule: [{ id: "s1", title: "Sketch stream", weekday: "Monday", timeUtc: "20:00 UTC" }],
    posts: [],
    shows: [{ id: "sh1", name: "Gallery night (stream)", date: "2026-05-01T18:00:00Z", kind: "stream" }],
    socials: { instagram: "https://instagram.com/artflow", x: "https://x.com/artflow" },
    meetups: {
      openToInPerson: true,
      headline: "Gallery openings",
      details: "I list public gallery events when they’re open to everyone.",
      regions: ["Lisbon"],
    },
  },
  talknight: {
    handle: "talknight",
    tagline: "Long-form conversations about internet culture.",
    bio: "$NIGHT funds better guests and production — holders suggest topics.",
    contracts: {
      creatorToken: addr("night-token"),
      nftTickets: addr("night-tix"),
      nftMoments: addr("night-mom"),
      nftPerks: addr("night-perk"),
    },
    announcements: [],
    schedule: [{ id: "s1", title: "Talk night", weekday: "Saturday", timeUtc: "21:00 UTC" }],
    posts: [],
    shows: [],
    socials: { x: "https://x.com/talknight", youtube: "https://youtube.com/@talknight" },
    meetups: { openToInPerson: false },
  },
};

function defaultProfile(streamer: StreamerMeta): CreatorProfileDetails {
  return {
    handle: streamer.id,
    tagline: `${streamer.category} on Gems.`,
    bio: `Creator on Gems with token $${streamer.tokenSymbol}. Full profile coming soon.`,
    contracts: {
      creatorToken: addr(`${streamer.id}-token`),
      nftTickets: addr(`${streamer.id}-tix`),
      nftMoments: addr(`${streamer.id}-mom`),
      nftPerks: addr(`${streamer.id}-perk`),
    },
    announcements: [],
    schedule: [],
    posts: [],
    shows: [],
    socials: {},
    meetups: { openToInPerson: false },
  };
}

export function getCreatorPublicProfile(id: string | undefined): CreatorPublicView | null {
  if (!id) return null;
  const streamer = STREAMERS.find((s) => s.id === id);
  if (!streamer) return null;
  const details = PROFILES[id] ?? defaultProfile(streamer);
  return { ...streamer, ...details };
}

