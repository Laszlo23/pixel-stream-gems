"use client";

import { CreatorStudioSidebar } from "@/components/CreatorStudioSidebar";

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 min-h-[calc(100dvh-3.5rem)] min-w-0 items-start">
      <CreatorStudioSidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
