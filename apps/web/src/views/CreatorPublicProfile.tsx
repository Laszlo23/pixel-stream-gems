import Link from "next/link";
import { useParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ContractAddressRow } from "@/components/ContractAddressRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bitcoin,
  Calendar,
  ExternalLink,
  MapPin,
  Megaphone,
  Radio,
  UserRound,
  FileText,
  Sparkles,
  Globe,
} from "lucide-react";
import { FanClubTiers } from "@/components/FanClubTiers";
import { CreatorCardThumbnail } from "@/components/creator/CreatorPublicMedia";
import { resolveStreamerPosterSrc } from "@/data/streamers";
import { CreatorFanMarketplaceSection } from "@/components/marketplace/CreatorFanMarketplaceSection";
import { getCreatorPublicProfile } from "@/data/creatorProfiles";
import type { CreatorSocials } from "@/data/creatorProfiles";
import { getCreatorFanShop } from "@/data/creatorFanMarketplace";

const socialLabels: { key: keyof CreatorSocials; label: string }[] = [
  { key: "website", label: "Website" },
  { key: "x", label: "X" },
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "farcaster", label: "Farcaster" },
  { key: "discord", label: "Discord" },
  { key: "github", label: "GitHub" },
  { key: "soundcloud", label: "SoundCloud" },
];

function formatShowDate(iso: string) {
  try {
    return format(parseISO(iso), "MMM d, yyyy · HH:mm 'UTC'");
  } catch {
    return iso;
  }
}

function formatPostDate(d: string) {
  try {
    return format(parseISO(d), "MMM d, yyyy");
  } catch {
    return d;
  }
}

const CreatorPublicProfile = () => {
  const params = useParams<{ id?: string }>();
  const raw = params?.id;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const p = getCreatorPublicProfile(id);

  if (!p) {
    return (
      <div className="min-h-full bg-background">
        <div className="container mx-auto px-4 pt-8 text-center">
          <h1 className="text-xl font-semibold text-foreground">Creator not found</h1>
          <p className="text-sm text-muted-foreground mt-2">This handle doesn&apos;t exist on Gems yet.</p>
          <Button asChild className="mt-6 rounded-xl">
            <Link href="/">Back to discover</Link>
          </Button>
        </div>
      </div>
    );
  }

  const socialEntries = socialLabels.filter((s) => p.socials[s.key]);
  const fanShop = getCreatorFanShop(p.id);
  const hasRedeemableNfts = (fanShop?.redeemable.length ?? 0) > 0;

  const posterWide = resolveStreamerPosterSrc(p, "16x9");
  const posterTall = resolveStreamerPosterSrc(p, "portrait");

  return (
    <div className="min-h-full bg-background hero-mesh">
      <div className="relative border-b border-border/80 overflow-hidden min-h-[220px] sm:min-h-[280px]">
        <CreatorCardThumbnail
          creatorId={p.id}
          mediaVariant="wide"
          posterSrc={posterWide}
          fallbackEmoji={p.avatar}
          className="absolute inset-0 opacity-[0.72] sm:opacity-[0.62]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
        <div className="relative container mx-auto px-4 pt-6 lg:pt-8 pb-12 max-w-4xl">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 rounded-xl gap-1 text-muted-foreground" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4" />
              Discover
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-end gap-6">
            <CreatorCardThumbnail
              creatorId={p.id}
              mediaVariant="portrait"
              posterSrc={posterTall}
              fallbackEmoji={p.avatar}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border border-border/60 shadow-lg shrink-0 overflow-hidden ring-2 ring-background/90"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-3xl font-semibold tracking-tight text-foreground">{p.name}</h1>
                <Badge variant="secondary" className="rounded-lg font-mono text-xs">
                  @{p.handle}
                </Badge>
                <Badge className="rounded-lg text-xs font-mono">${p.tokenSymbol}</Badge>
              </div>
              <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">{p.tagline}</p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Button asChild className="rounded-xl gap-2 shadow-[0_0_20px_hsl(var(--primary)/0.25)]">
                  <Link href={`/live/${p.id}`}>
                    <Radio className="w-4 h-4" />
                    Join the show
                  </Link>
                </Button>
                {fanShop && (
                  <Button asChild variant="outline" className="rounded-xl bg-background/50 backdrop-blur-sm gap-1.5 border-border/60">
                    <Link href="#fan-collectables">
                      <Sparkles className="w-4 h-4" />
                      Fan collectables
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-4xl space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <UserRound className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">About</h2>
          </div>
          <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0 sm:p-0">
              <div className="flex flex-col sm:flex-row gap-0 sm:gap-0">
                <CreatorCardThumbnail
                  creatorId={p.id}
                  mediaVariant="portrait"
                  posterSrc={posterTall}
                  fallbackEmoji={p.avatar}
                  className="w-full sm:w-[min(100%,280px)] aspect-[4/5] sm:aspect-auto sm:min-h-[220px] shrink-0 border-b sm:border-b-0 sm:border-r border-border/60"
                />
                <div className="p-6 text-sm text-muted-foreground leading-relaxed flex-1 min-w-0">{p.bio}</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <FanClubTiers tokenSymbol={p.tokenSymbol} />

        {fanShop && <CreatorFanMarketplaceSection shop={fanShop} creatorName={p.name} />}

        {p.announcements.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Announcements</h2>
            </div>
            <div className="space-y-3">
              {p.announcements
                .slice()
                .sort((a, b) => +!!b.pinned - +!!a.pinned || b.date.localeCompare(a.date))
                .map((a) => (
                  <Card key={a.id} className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {a.pinned && (
                          <Badge variant="default" className="rounded-md text-[10px]">
                            Pinned
                          </Badge>
                        )}
                        <CardTitle className="text-base">{a.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">{formatPostDate(a.date)}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground leading-relaxed pt-0">{a.body}</CardContent>
                  </Card>
                ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Schedule</h2>
          </div>
          {p.schedule.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recurring hours posted yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {p.schedule.map((s) => (
                <Card key={s.id} className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {s.weekday} · {s.timeUtc}
                    </CardDescription>
                  </CardHeader>
                  {s.note && <CardContent className="text-xs text-muted-foreground pt-0">{s.note}</CardContent>}
                </Card>
              ))}
            </div>
          )}
        </section>

        {p.posts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Posts</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {p.posts.map((post) => (
                <Card key={post.id} className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base leading-snug">{post.title}</CardTitle>
                    <CardDescription className="text-xs">{formatPostDate(post.date)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                    <p className="text-xs text-foreground/80 leading-relaxed line-clamp-4">{post.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Digital registry</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
            <Bitcoin className="w-3.5 h-3.5" />
            Creator coin &amp; support pool vs {p.btcPeg} ({p.poolTvlUsd} — demo)
          </p>
          <div className="space-y-2">
            <ContractAddressRow label="Creator coin" address={p.contracts.creatorToken} />
            <ContractAddressRow label="Access passes" address={p.contracts.nftTickets} />
            <ContractAddressRow label="Moment cards" address={p.contracts.nftMoments} />
            <ContractAddressRow label="Perks &amp; vouchers" address={p.contracts.nftPerks} />
          </div>
        </section>

        {p.shows.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Radio className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Shows & events</h2>
            </div>
            <div className="space-y-3">
              {p.shows.map((sh) => (
                <Card key={sh.id} className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
                  <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4">
                    <div>
                      <p className="font-medium text-foreground">{sh.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatShowDate(sh.date)}</p>
                      {sh.venue && (
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {sh.venue}
                        </p>
                      )}
                      <Badge variant="outline" className="mt-2 rounded-md text-[10px] capitalize">
                        {sh.kind.replaceAll("_", " ")}
                      </Badge>
                    </div>
                    {sh.url && (
                      <Button variant="outline" size="sm" className="rounded-xl shrink-0 gap-1.5" asChild>
                        <a href={sh.url} target="_blank" rel="noreferrer noopener">
                          Details
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground tracking-tight">Public appearances & IRL context</h2>
          </div>
          <Card className="rounded-2xl border-border/80 bg-card/70 backdrop-blur-sm">
            <CardContent className="pt-6 space-y-3 text-sm">
              {hasRedeemableNfts && (
                <>
                  <p className="text-muted-foreground leading-relaxed">
                    This creator sells{" "}
                    <Link href="#fan-collectables" className="text-primary font-medium underline-offset-4 hover:underline">
                      redeemable fan vouchers
                    </Link>{" "}
                    on their shelf. Those are <span className="text-foreground">private, consenting-adult arrangements</span>{" "}
                    scheduled through Gems after you claim — subject to local law and each listing&apos;s
                    written scope. Gems does not broker or supervise off-platform time.
                  </p>
                  <Separator />
                </>
              )}
              <p className="text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">Public calendar</span> covers conferences, panels, ticketed
                shows, and other appearances this creator advertises to everyone — separate from private voucher tiers.
              </p>
              <Separator />
              {p.meetups.openToInPerson ? (
                <>
                  {p.meetups.headline && <p className="font-medium text-foreground">{p.meetups.headline}</p>}
                  {p.meetups.details && <p className="text-muted-foreground leading-relaxed">{p.meetups.details}</p>}
                  {p.meetups.regions && p.meetups.regions.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {p.meetups.regions.map((r) => (
                        <Badge key={r} variant="secondary" className="rounded-lg font-normal">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">
                  No open public IRL calendar on Gems right now{hasRedeemableNfts ? " (see redeemable tiers above)." : "."}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {socialEntries.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground tracking-tight">Social</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {socialEntries.map(({ key, label }) => {
                const href = p.socials[key];
                if (!href) return null;
                return (
                  <Button key={key} variant="outline" size="sm" className="rounded-xl gap-1.5" asChild>
                    <a href={href} target="_blank" rel="noreferrer noopener">
                      {label}
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CreatorPublicProfile;
