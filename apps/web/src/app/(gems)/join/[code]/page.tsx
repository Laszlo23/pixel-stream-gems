"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { storePendingReferral } from "@/lib/referralStorage";

export default function JoinReferralPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const raw = params.code;
    const code = Array.isArray(raw) ? raw[0] : raw;
    if (typeof code === "string" && code) storePendingReferral(code);
    router.replace("/");
  }, [params, router]);

  return (
    <div className="container mx-auto px-4 py-16 text-center text-sm text-muted-foreground">Joining…</div>
  );
}
