/** Internal legal & policy routes — keep in sync with each route under app/(gems)/legal. */
export const LEGAL_PAGES = [
  { href: "/legal/terms", label: "Terms of Service", short: "Terms" },
  { href: "/legal/privacy", label: "Privacy Policy", short: "Privacy" },
  { href: "/legal/cookies", label: "Cookie Policy", short: "Cookies" },
  { href: "/legal/imprint", label: "Imprint", short: "Imprint" },
  { href: "/legal/dmca", label: "DMCA / Copyright", short: "DMCA" },
  { href: "/legal/acceptable-use", label: "Acceptable use", short: "Acceptable use" },
] as const;
