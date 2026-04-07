/**
 * When true, the app runs without Privy: standard wagmi + mock auth context so UI loads.
 * Set NEXT_PUBLIC_PRIVY_DISABLED=1 or leave NEXT_PUBLIC_PRIVY_APP_ID empty.
 */
export function shouldUsePrivyBypass(): boolean {
  if (typeof process.env.NEXT_PUBLIC_PRIVY_DISABLED === "string") {
    const v = process.env.NEXT_PUBLIC_PRIVY_DISABLED.trim().toLowerCase();
    if (v === "1" || v === "true" || v === "yes") return true;
  }
  const id = process.env.NEXT_PUBLIC_PRIVY_APP_ID?.trim() ?? "";
  return id.length === 0;
}
