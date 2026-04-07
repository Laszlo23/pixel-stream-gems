import "./globals.css";

import type { Metadata } from "next";
import { Providers } from "./providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`) : new URL("http://localhost:3000"),
  title: "Gems — Live shows & fan collectables",
  description:
    "Discover creators, join live shows, send love, and collect moments. Premium nightlife energy — the tech stays in the background.",
};

/**
 * Wallet / Privy providers are client-only (`Web3Provider`); do not import wagmi config here.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
