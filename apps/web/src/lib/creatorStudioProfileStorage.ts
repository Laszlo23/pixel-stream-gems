/** Local draft for creator studio — replace with API when backend ships. */

export const CREATOR_STUDIO_STORAGE_KEY = "gems-creator-studio-profile";
export const CREATOR_STUDIO_VERSION = 1 as const;

export type KycStudioStatus = "not_started" | "call_requested" | "call_scheduled" | "verified" | "rejected";

export type ScheduledLiveShow = {
  id: string;
  title: string;
  /** ISO 8601 */
  startsAt: string;
  durationMinutes: number;
  visibility: "public" | "token_gated" | "unlisted";
  notes?: string;
};

export type CreatorStudioSocials = {
  website: string;
  x: string;
  instagram: string;
  youtube: string;
  farcaster: string;
  discord: string;
  github: string;
  soundcloud: string;
};

export type CreatorStudioProfile = {
  version: typeof CREATOR_STUDIO_VERSION;
  displayName: string;
  handle: string;
  tagline: string;
  bio: string;
  /** URL or data URL (small images only — prefer hosted URL in production) */
  profileImageUrl: string;
  socials: CreatorStudioSocials;
  scheduledShows: ScheduledLiveShow[];
  kyc: {
    status: KycStudioStatus;
    contactEmail: string;
    /** Free text: preferred times / notes for the office team */
    schedulingNotes: string;
  };
};

export function defaultCreatorStudioProfile(): CreatorStudioProfile {
  return {
    version: CREATOR_STUDIO_VERSION,
    displayName: "",
    handle: "",
    tagline: "",
    bio: "",
    profileImageUrl: "",
    socials: {
      website: "",
      x: "",
      instagram: "",
      youtube: "",
      farcaster: "",
      discord: "",
      github: "",
      soundcloud: "",
    },
    scheduledShows: [],
    kyc: {
      status: "not_started",
      contactEmail: "",
      schedulingNotes: "",
    },
  };
}

export function loadCreatorStudioProfile(): CreatorStudioProfile {
  if (typeof window === "undefined") return defaultCreatorStudioProfile();
  try {
    const raw = localStorage.getItem(CREATOR_STUDIO_STORAGE_KEY);
    if (!raw) return defaultCreatorStudioProfile();
    const j = JSON.parse(raw) as Partial<CreatorStudioProfile>;
    if (j.version !== CREATOR_STUDIO_VERSION) return defaultCreatorStudioProfile();
    const base = defaultCreatorStudioProfile();
    return {
      ...base,
      ...j,
      socials: { ...base.socials, ...(j.socials ?? {}) },
      scheduledShows: Array.isArray(j.scheduledShows) ? j.scheduledShows : [],
      kyc: { ...base.kyc, ...(j.kyc ?? {}) },
    };
  } catch {
    return defaultCreatorStudioProfile();
  }
}

export function saveCreatorStudioProfile(p: CreatorStudioProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CREATOR_STUDIO_STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* quota */
  }
}
