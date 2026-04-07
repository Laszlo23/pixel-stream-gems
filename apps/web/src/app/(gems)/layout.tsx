"use client";

import { GemsChrome } from "@/components/GemsChrome";

export default function GemsLayout({ children }: { children: React.ReactNode }) {
  return <GemsChrome>{children}</GemsChrome>;
}
