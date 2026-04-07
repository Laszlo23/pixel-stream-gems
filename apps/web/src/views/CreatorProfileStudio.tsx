"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarPlus,
  Camera,
  CheckCircle2,
  Clock,
  Globe,
  Mail,
  ShieldCheck,
  Trash2,
  UserRound,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCreatorStudioProfile } from "@/hooks/useCreatorStudioProfile";
import type {
  CreatorStudioSocials,
  KycStudioStatus,
  ScheduledLiveShow,
} from "@/lib/creatorStudioProfileStorage";
import { cn } from "@/lib/utils";

const SOCIAL_FIELDS: { key: keyof CreatorStudioSocials; label: string; placeholder: string }[] = [
  { key: "website", label: "Website", placeholder: "https://…" },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/…" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@…" },
  { key: "farcaster", label: "Farcaster", placeholder: "https://warpcast.com/…" },
  { key: "discord", label: "Discord invite", placeholder: "https://discord.gg/…" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/…" },
  { key: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/…" },
];

function kycLabel(s: KycStudioStatus): string {
  switch (s) {
    case "not_started":
      return "Not started";
    case "call_requested":
      return "Call requested";
    case "call_scheduled":
      return "Call scheduled";
    case "verified":
      return "Verified";
    case "rejected":
      return "Needs follow-up";
    default:
      return s;
  }
}

function formatShowTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

const TAB_IDS = ["profile", "schedule", "socials", "verification"] as const;

export function CreatorProfileStudio() {
  const { profile, update, hydrated } = useCreatorStudioProfile();
  const pathname = usePathname();
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const syncFromHash = () => {
      const h = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
      if ((TAB_IDS as readonly string[]).includes(h)) setTab(h);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [pathname]);

  const setHash = useCallback((v: string) => {
    setTab(v);
    window.history.replaceState(null, "", `#${v}`);
  }, []);

  const sortedShows = useMemo(
    () => [...profile.scheduledShows].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [profile.scheduledShows],
  );

  const onImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (f.size > 400_000) {
      toast.error("Image too large for browser draft (max ~400KB). Use an image URL instead.");
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      const data = r.result as string;
      update((p) => ({ ...p, profileImageUrl: data }));
      toast.success("Profile picture updated (saved in this browser).");
    };
    r.readAsDataURL(f);
  };

  const addShow = (form: FormData) => {
    const title = String(form.get("title") ?? "").trim();
    const local = String(form.get("starts") ?? "");
    const duration = Math.max(15, Math.min(12 * 60, Number(form.get("duration")) || 90));
    const visibility = String(form.get("visibility") ?? "public") as ScheduledLiveShow["visibility"];
    if (!title || !local) {
      toast.error("Add a title and start time.");
      return;
    }
    const startsAt = new Date(local).toISOString();
    if (Number.isNaN(new Date(startsAt).getTime())) {
      toast.error("Invalid date.");
      return;
    }
    const row: ScheduledLiveShow = {
      id: crypto.randomUUID(),
      title,
      startsAt,
      durationMinutes: duration,
      visibility,
      notes: String(form.get("notes") ?? "").trim() || undefined,
    };
    update((p) => ({ ...p, scheduledShows: [...p.scheduledShows, row] }));
    toast.success("Show added to your schedule.");
  };

  const removeShow = (id: string) => {
    update((p) => ({ ...p, scheduledShows: p.scheduledShows.filter((s) => s.id !== id) }));
    toast.message("Removed from schedule");
  };

  const requestKycCall = () => {
    if (!profile.kyc.contactEmail.trim()) {
      toast.error("Add a contact email so our team can reach you.");
      return;
    }
    update((p) => ({
      ...p,
      kyc: { ...p.kyc, status: "call_requested" },
    }));
    toast.success("Request saved", {
      description: "Our office will email you to book a video verification slot.",
    });
  };

  const markCallScheduled = () => {
    update((p) => ({
      ...p,
      kyc: { ...p.kyc, status: "call_scheduled" },
    }));
    toast.message("Updated", { description: "Status set to: call scheduled." });
  };

  if (!hydrated) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <p className="text-sm text-muted-foreground">Loading studio…</p>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-20 max-w-4xl space-y-6">
      <div>
        <Link href="/creator" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="w-3 h-3" /> Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Profile &amp; presence</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Update how you appear on Gems, plan live shows, and link your socials. Drafts save in this browser until your
              backend syncs creator accounts.
            </p>
          </div>
          <Badge variant="outline" className="rounded-lg text-[10px] w-fit shrink-0">
            Local draft · not yet synced
          </Badge>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setHash} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1 rounded-xl bg-secondary/80 p-1 justify-start">
          <TabsTrigger value="profile" className="rounded-lg text-xs gap-1.5">
            <UserRound className="w-3.5 h-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-lg text-xs gap-1.5">
            <CalendarPlus className="w-3.5 h-3.5" /> Live schedule
          </TabsTrigger>
          <TabsTrigger value="socials" className="rounded-lg text-xs gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Socials
          </TabsTrigger>
          <TabsTrigger value="verification" className="rounded-lg text-xs gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Verification
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" id="profile" className="space-y-4 mt-0 scroll-mt-28">
          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Camera className="w-4 h-4 text-primary" />
                Profile picture
              </CardTitle>
              <CardDescription className="text-xs">
                Fans see this on your public profile and cards. Prefer a square image; we crop with cover in the app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div
                  className={cn(
                    "w-28 h-28 rounded-2xl border border-border/70 bg-secondary/40 overflow-hidden shrink-0",
                    "flex items-center justify-center text-muted-foreground text-xs text-center px-2",
                  )}
                >
                  {profile.profileImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- user data URL / arbitrary URL
                    <img src={profile.profileImageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    "No photo"
                  )}
                </div>
                <div className="flex-1 space-y-3 w-full min-w-0">
                  <div className="space-y-2">
                    <Label htmlFor="p-url" className="text-xs">
                      Image URL
                    </Label>
                    <Input
                      id="p-url"
                      className="rounded-xl text-sm"
                      placeholder="https://… or /camgirls/camgirl1.jpg"
                      value={profile.profileImageUrl.startsWith("data:") ? "" : profile.profileImageUrl}
                      onChange={(e) => update((p) => ({ ...p, profileImageUrl: e.target.value.trim() }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Upload (small files only)</Label>
                    <Input type="file" accept="image/*" className="cursor-pointer text-xs rounded-xl" onChange={onImageFile} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Public copy</CardTitle>
              <CardDescription className="text-xs">Shown on your creator profile when wired to your channel id.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dname" className="text-xs">
                    Display name
                  </Label>
                  <Input
                    id="dname"
                    className="rounded-xl"
                    value={profile.displayName}
                    onChange={(e) => update((p) => ({ ...p, displayName: e.target.value }))}
                    placeholder="Maya"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="handle" className="text-xs">
                    Handle (without @)
                  </Label>
                  <Input
                    id="handle"
                    className="rounded-xl font-mono text-sm"
                    value={profile.handle}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                      }))
                    }
                    placeholder="maya"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag" className="text-xs">
                  Tagline
                </Label>
                <Input
                  id="tag"
                  className="rounded-xl"
                  value={profile.tagline}
                  onChange={(e) => update((p) => ({ ...p, tagline: e.target.value }))}
                  placeholder="One line under your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-xs">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  className="rounded-xl min-h-[120px] text-sm"
                  value={profile.bio}
                  onChange={(e) => update((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell fans what you stream and what your coin unlocks."
                />
              </div>
              {profile.handle && (
                <p className="text-[11px] text-muted-foreground">
                  Preview public URL pattern:{" "}
                  <Link href={`/u/${profile.handle}`} className="text-primary hover:underline font-mono">
                    /u/{profile.handle}
                  </Link>{" "}
                  (must match your registered creator id when live).
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" id="schedule" className="space-y-4 mt-0 scroll-mt-28">
          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Schedule a live show
              </CardTitle>
              <CardDescription className="text-xs">
                Plan upcoming streams. In production this feeds your public schedule and reminder notifications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  addShow(new FormData(e.currentTarget));
                  e.currentTarget.reset();
                }}
              >
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="show-title" className="text-xs">
                    Title
                  </Label>
                  <Input id="show-title" name="title" className="rounded-xl" placeholder="Acoustic set + Q&A" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show-start" className="text-xs">
                    Start (your local time)
                  </Label>
                  <Input id="show-start" name="starts" type="datetime-local" className="rounded-xl" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="show-dur" className="text-xs">
                    Duration (minutes)
                  </Label>
                  <Input id="show-dur" name="duration" type="number" min={15} max={720} defaultValue={90} className="rounded-xl" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="show-vis" className="text-xs">
                    Visibility
                  </Label>
                  <select
                    id="show-vis"
                    name="visibility"
                    defaultValue="public"
                    className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="public">Public — listed on Gems</option>
                    <option value="token_gated">Token-gated</option>
                    <option value="unlisted">Unlisted (link only)</option>
                  </select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="show-notes" className="text-xs">
                    Notes (optional)
                  </Label>
                  <Textarea id="show-notes" name="notes" className="rounded-xl min-h-[72px] text-sm" placeholder="Gear, guests, giveaway…" />
                </div>
                <Button type="submit" className="rounded-xl sm:col-span-2 w-full sm:w-auto">
                  Add to schedule
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                Upcoming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedShows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No shows scheduled yet.</p>
              ) : (
                <ul className="space-y-2">
                  {sortedShows.map((s) => (
                    <li
                      key={s.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{formatShowTime(s.startsAt)} · {s.durationMinutes} min</p>
                        <Badge variant="secondary" className="mt-2 rounded-md text-[10px] font-normal capitalize">
                          {s.visibility.replaceAll("_", " ")}
                        </Badge>
                        {s.notes && <p className="text-[11px] text-muted-foreground mt-2">{s.notes}</p>}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-xl shrink-0 self-end sm:self-center text-destructive hover:text-destructive"
                        onClick={() => removeShow(s.id)}
                        aria-label="Remove show"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="socials" id="socials" className="space-y-4 mt-0 scroll-mt-28">
          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Social links</CardTitle>
              <CardDescription className="text-xs">These map to the same fields as your public creator profile.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    className="rounded-xl text-sm"
                    placeholder={placeholder}
                    value={profile.socials[key]}
                    onChange={(e) =>
                      update((p) => ({
                        ...p,
                        socials: { ...p.socials, [key]: e.target.value },
                      }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" id="verification" className="space-y-4 mt-0 scroll-mt-28">
          <Card className="rounded-2xl border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                Creator verification (KYC)
              </CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Gems verifies creators through a <span className="text-foreground font-medium">short video call</span> with a
                member of our team at the office — not an automated document-only flow. We confirm identity, channel fit, and
                policy alignment before full monetization features unlock.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <ul className="list-disc pl-4 space-y-1 text-xs">
                <li>You&apos;ll receive scheduling options by email after you request a call.</li>
                <li>Have a government ID ready to show on camera when instructed.</li>
                <li>Typical calls take about 10–15 minutes.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/80 bg-card/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Your status
                </span>
                <Badge
                  variant={profile.kyc.status === "verified" ? "default" : "secondary"}
                  className="rounded-lg text-[10px] capitalize"
                >
                  {kycLabel(profile.kyc.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kyc-email" className="text-xs">
                  Contact email
                </Label>
                <Input
                  id="kyc-email"
                  type="email"
                  className="rounded-xl"
                  placeholder="you@example.com"
                  value={profile.kyc.contactEmail}
                  onChange={(e) => update((p) => ({ ...p, kyc: { ...p.kyc, contactEmail: e.target.value } }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kyc-notes" className="text-xs">
                  Availability / notes for our team
                </Label>
                <Textarea
                  id="kyc-notes"
                  className="rounded-xl min-h-[88px] text-sm"
                  placeholder="Time zones, preferred days, language…"
                  value={profile.kyc.schedulingNotes}
                  onChange={(e) => update((p) => ({ ...p, kyc: { ...p.kyc, schedulingNotes: e.target.value } }))}
                />
              </div>
              <Separator />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="button" className="rounded-xl gap-2" onClick={requestKycCall}>
                  <ShieldCheck className="w-4 h-4" />
                  Request verification call
                </Button>
                <Button type="button" variant="outline" className="rounded-xl" onClick={markCallScheduled}>
                  I already booked with the team
                </Button>
              </div>
              {profile.kyc.status === "verified" && (
                <p className="text-xs text-primary flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Your profile is marked verified in this draft. Production status comes from our admin tools.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
