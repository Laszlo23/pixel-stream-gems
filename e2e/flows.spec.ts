import { test, expect } from "@playwright/test";

test.describe("marketing and onboarding shells", () => {
  test("home: Join free CTA and Built on strip", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /join free/i }).first()).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByText("Built on", { exact: false })).toBeVisible();
    const zeroG = page.locator('a[href*="0g"]');
    await expect(zeroG.first()).toBeVisible();
    const baseLink = page.locator('a[href*="base.org"]');
    await expect(baseLink.first()).toBeVisible();
  });

  test("sign-in route shows loading copy", async ({ page }) => {
    await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/opening sign in/i)).toBeVisible();
  });

  test("creator go-live: heading and demo room link", async ({ page }) => {
    await page.goto("/creator/go-live", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /go live/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /open demo live room/i })).toHaveAttribute("href", /\/live\/maya/);
  });

  test("fan onboarding: distinctive title", async ({ page }) => {
    await page.goto("/onboarding/fan", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/your front-row pass/i)).toBeVisible();
  });

  test("creator onboarding: distinctive title", async ({ page }) => {
    await page.goto("/onboarding/creator", { waitUntil: "domcontentloaded" });
    await expect(page.getByText(/creator spotlight/i)).toBeVisible();
  });
});
