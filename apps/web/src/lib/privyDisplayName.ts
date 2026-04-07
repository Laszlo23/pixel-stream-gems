import type { User } from "@privy-io/react-auth";

/** Short handle for live chat from Privy user + optional wallet. */
export function privyDisplayName(user: User | null | undefined, walletAddress?: string | null): string {
  if (user?.google?.name) return user.google.name;
  if (user?.google?.email) return user.google.email.split("@")[0] ?? "fan";
  if (user?.apple?.email) return user.apple.email.split("@")[0] ?? "fan";
  if (user?.email?.address) return user.email.address.split("@")[0] ?? "fan";
  if (walletAddress) return `Fan ${walletAddress.slice(0, 6)}`;
  return "Guest";
}
