const FAN_KEY = "gems.onboarding.fan.v1";
const CREATOR_KEY = "gems.onboarding.creator.v1";

export type OnboardingRecordV1 = {
  version: 1;
  complete: boolean;
  completedAt?: string;
  /** Optional fan display hint for chat */
  displayName?: string;
};

function safeParse(raw: string | null): OnboardingRecordV1 | null {
  if (!raw) return null;
  try {
    const j = JSON.parse(raw) as OnboardingRecordV1;
    if (j && j.version === 1 && typeof j.complete === "boolean") return j;
  } catch {
    /* ignore */
  }
  return null;
}

export function getFanOnboarding(): OnboardingRecordV1 | null {
  if (typeof window === "undefined") return null;
  return safeParse(localStorage.getItem(FAN_KEY));
}

export function isFanOnboardingComplete(): boolean {
  return getFanOnboarding()?.complete === true;
}

export function setFanOnboarding(data: Partial<OnboardingRecordV1> & { complete: boolean }) {
  if (typeof window === "undefined") return;
  const prev = getFanOnboarding() ?? { version: 1 as const, complete: false };
  const next: OnboardingRecordV1 = {
    ...prev,
    ...data,
    version: 1,
    completedAt: data.complete ? new Date().toISOString() : prev.completedAt,
  };
  localStorage.setItem(FAN_KEY, JSON.stringify(next));
}

export function getCreatorOnboarding(): OnboardingRecordV1 | null {
  if (typeof window === "undefined") return null;
  return safeParse(localStorage.getItem(CREATOR_KEY));
}

export function isCreatorOnboardingComplete(): boolean {
  return getCreatorOnboarding()?.complete === true;
}

export function setCreatorOnboarding(data: Partial<OnboardingRecordV1> & { complete: boolean }) {
  if (typeof window === "undefined") return;
  const prev = getCreatorOnboarding() ?? { version: 1 as const, complete: false };
  const next: OnboardingRecordV1 = {
    ...prev,
    ...data,
    version: 1,
    completedAt: data.complete ? new Date().toISOString() : prev.completedAt,
  };
  localStorage.setItem(CREATOR_KEY, JSON.stringify(next));
}
