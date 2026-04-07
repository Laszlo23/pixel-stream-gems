import type { Metadata } from "next";
import { getCreatorPublicProfile } from "@/data/creatorProfiles";
import { resolveStreamerPosterSrc } from "@/data/streamers";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = getCreatorPublicProfile(id);
  if (!p) {
    return { title: "Creator not found · Gems" };
  }
  const ogImage = resolveStreamerPosterSrc(p, "16x9");
  return {
    title: `${p.name} (@${p.handle}) · Gems`,
    description: p.tagline,
    openGraph: {
      title: `${p.name} on Gems`,
      description: p.tagline,
      images: [{ url: ogImage, width: 1200, height: 630, alt: p.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.name} on Gems`,
      description: p.tagline,
      images: [ogImage],
    },
  };
}

export default function CreatorPublicProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
