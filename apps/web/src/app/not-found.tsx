"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display mb-2 text-5xl font-bold text-gradient">404</h1>
        <p className="mb-6 text-sm text-muted-foreground">This page doesn&apos;t exist or was moved.</p>
        <Link
          href="/"
          className="text-sm font-medium text-[hsl(var(--accent-glow))] underline-offset-4 hover:underline"
        >
          ← Back to home
        </Link>
        <p className="mt-6 text-[11px] text-muted-foreground">
          <Link href="/legal" className="hover:text-foreground underline-offset-2 hover:underline">
            Legal &amp; policies
          </Link>
        </p>
      </div>
    </div>
  );
}
