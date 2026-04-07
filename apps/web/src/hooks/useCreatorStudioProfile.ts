"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type CreatorStudioProfile,
  loadCreatorStudioProfile,
  saveCreatorStudioProfile,
} from "@/lib/creatorStudioProfileStorage";

export function useCreatorStudioProfile() {
  const [profile, setProfile] = useState<CreatorStudioProfile>(() => loadCreatorStudioProfile());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadCreatorStudioProfile());
    setHydrated(true);
  }, []);

  const update = useCallback((fn: (prev: CreatorStudioProfile) => CreatorStudioProfile) => {
    setProfile((prev) => {
      const next = fn(prev);
      saveCreatorStudioProfile(next);
      return next;
    });
  }, []);

  const replace = useCallback((next: CreatorStudioProfile) => {
    saveCreatorStudioProfile(next);
    setProfile(next);
  }, []);

  return { profile, update, replace, hydrated };
}
