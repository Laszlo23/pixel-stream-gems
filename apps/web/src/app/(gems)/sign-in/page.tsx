"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppPrivy } from "@/hooks/usePrivyCompat";
import { useAccount } from "wagmi";

/**
 * Deep link or footer CTA: opens Privy registration / login, then sends users to profile.
 */
export default function SignInPage() {
  const router = useRouter();
  const { login, authenticated, ready } = useAppPrivy();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!ready) return;
    if (authenticated && isConnected) router.replace("/profile");
  }, [ready, authenticated, isConnected, router]);

  useEffect(() => {
    if (!ready || authenticated) return;
    login();
  }, [ready, authenticated, login]);

  return (
    <div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">
      Opening sign in…
    </div>
  );
}
