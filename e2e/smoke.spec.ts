import { test, expect } from "@playwright/test";

/** Public routes that should return HTML without Privy login (shell may still load SDK). */
const paths = [
  "/",
  "/discover",
  "/sign-in",
  "/onboarding/fan",
  "/onboarding/creator",
  "/creator",
  "/creator/go-live",
  "/creator/stream-manager",
  "/creator/token",
  "/creator/nft",
  "/creator/ai",
  "/profile",
  "/legal",
  "/legal/terms",
  "/legal/privacy",
  "/legal/cookies",
  "/legal/imprint",
  "/legal/dmca",
  "/legal/acceptable-use",
  "/safety",
  "/u/maya",
  "/live/maya",
  "/marketplace",
  "/competitions",
  "/messages",
  "/defi",
  "/clips",
  "/leaderboards",
  "/settings",
  "/join/demo",
];

for (const path of paths) {
  test(`page ${path} loads`, async ({ page }) => {
    const res = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(res?.ok(), `expected 2xx for ${path}, got ${res?.status()}`).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });
}
