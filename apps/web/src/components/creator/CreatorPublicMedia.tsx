"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { creatorAmbientVideoPath, creatorPosterPath } from "@/data/streamers";

const FALLBACK_BG = "#0A0A0A";

/** If a path 404s, try other extensions (jpg / png / jpeg / webp) on the same base name. */
function posterFallbackCandidates(url: string): string[] {
  const [pathPart, query = ""] = url.split("?");
  const suffix = query ? `?${query}` : "";
  const m = pathPart.match(/^(.*)\.(png|jpe?g|webp)$/i);
  if (!m) return [url];
  const base = m[1];
  const exts = ["png", "jpg", "jpeg", "webp"];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const ext of exts) {
    const u = `${base}.${ext}${suffix}`;
    if (!seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

type CardProps = {
  creatorId: string;
  /** @deprecated unused — previews use solid backdrop + your PNG */
  thumbnailColor?: string;
  posterSrc?: string;
  /** Shown only if the PNG fails to load */
  fallbackEmoji?: string;
  className?: string;
  children?: React.ReactNode;
  /** Tall tiles: bias crop toward top (head). Wide: ambient loop + poster fallback. */
  mediaVariant?: "portrait" | "wide";
  videoSrc?: string;
};

/**
 * Card preview stills / video: `public/camgirls/preview-*` or overrides. Solid #0A0A0A until media loads.
 */
export function CreatorCardThumbnail({
  creatorId,
  posterSrc,
  fallbackEmoji,
  className,
  children,
  mediaVariant = "wide",
  videoSrc: videoSrcProp,
}: CardProps) {
  const candidates = useMemo(() => {
    const primary = posterSrc ?? creatorPosterPath(creatorId);
    return posterFallbackCandidates(primary);
  }, [posterSrc, creatorId]);

  const videoSrc = videoSrcProp ?? creatorAmbientVideoPath(creatorId);
  const posterFirst = candidates[0] ?? creatorPosterPath(creatorId);

  if (mediaVariant === "portrait") {
    return (
      <PortraitCardMedia
        candidates={candidates}
        fallbackEmoji={fallbackEmoji}
        className={className}
      >
        {children}
      </PortraitCardMedia>
    );
  }

  return (
    <WideCardMedia
      key={`${creatorId}-${videoSrc}-${candidates.join("|")}`}
      videoSrc={videoSrc}
      posterFirst={posterFirst}
      candidates={candidates}
      fallbackEmoji={fallbackEmoji}
      className={className}
    >
      {children}
    </WideCardMedia>
  );
}

function PortraitCardMedia({
  candidates,
  fallbackEmoji,
  className,
  children,
}: {
  candidates: string[];
  fallbackEmoji?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [media, setMedia] = useState<"loading" | "ready" | "error">("loading");
  const [candidateIdx, setCandidateIdx] = useState(0);
  const src = candidates[Math.min(candidateIdx, Math.max(0, candidates.length - 1))];

  const onLoad = useCallback(() => setMedia("ready"), []);
  const onImgError = useCallback(() => {
    setCandidateIdx((i) => {
      if (i < candidates.length - 1) return i + 1;
      setMedia("error");
      return i;
    });
  }, [candidates.length]);

  useEffect(() => {
    setMedia("loading");
    setCandidateIdx(0);
  }, [candidates]);

  useEffect(() => {
    setMedia("loading");
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ backgroundColor: FALLBACK_BG }}>
      {media !== "error" && candidates.length > 0 && (
        // eslint-disable-next-line @next/next/no-img-element -- public folder assets, dynamic path
        <img
          key={src}
          src={src}
          alt=""
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover object-top pointer-events-none transition-opacity duration-300",
            media === "loading" ? "opacity-0" : "opacity-100",
          )}
          onLoad={onLoad}
          onError={onImgError}
        />
      )}
      {media === "error" && fallbackEmoji ? (
        <span className="absolute inset-0 z-[1] flex items-center justify-center text-5xl text-white/30 select-none pointer-events-none">
          {fallbackEmoji}
        </span>
      ) : null}
      {children}
    </div>
  );
}

function WideCardMedia({
  videoSrc,
  posterFirst,
  candidates,
  fallbackEmoji,
  className,
  children,
}: {
  videoSrc: string;
  posterFirst: string;
  candidates: string[];
  fallbackEmoji?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [phase, setPhase] = useState<"video" | "image" | "error">("video");
  const [media, setMedia] = useState<"loading" | "ready" | "error">("loading");
  const [candidateIdx, setCandidateIdx] = useState(0);

  const src = candidates[Math.min(candidateIdx, Math.max(0, candidates.length - 1))];

  useEffect(() => {
    setPhase("video");
    setMedia("loading");
    setCandidateIdx(0);
  }, [videoSrc, candidates]);

  const onImgLoad = useCallback(() => setMedia("ready"), []);
  const onImgError = useCallback(() => {
    setCandidateIdx((i) => {
      if (i < candidates.length - 1) return i + 1;
      setMedia("error");
      return i;
    });
  }, [candidates.length]);

  useEffect(() => {
    if (phase === "image") setMedia("loading");
  }, [src, phase]);

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ backgroundColor: FALLBACK_BG }}>
      {phase === "video" && (
        <video
          key={videoSrc}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          src={videoSrc}
          poster={posterFirst}
          muted
          playsInline
          loop
          autoPlay
          onError={() => setPhase("image")}
        />
      )}
      {phase === "image" && candidates.length > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-300",
            media === "loading" ? "opacity-0" : "opacity-100",
          )}
          onLoad={onImgLoad}
          onError={onImgError}
        />
      )}
      {phase === "image" && media === "error" && fallbackEmoji ? (
        <span className="absolute inset-0 z-[1] flex items-center justify-center text-5xl text-white/30 select-none pointer-events-none">
          {fallbackEmoji}
        </span>
      ) : null}
      {children}
    </div>
  );
}

type StageProps = {
  creatorId: string;
  thumbnailColor?: string;
  posterSrc?: string;
  videoSrc?: string;
  /** No vignette — only the photo/video (plus UI children you pass). */
  bare?: boolean;
  /** Center content only when neither video nor poster could be loaded */
  placeholder?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
};

function PosterStack({
  poster,
  className,
  onAllFailed,
}: {
  poster: string;
  className?: string;
  onAllFailed?: () => void;
}) {
  const candidates = useMemo(() => posterFallbackCandidates(poster), [poster]);
  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
  }, [poster]);

  const src = candidates[Math.min(i, candidates.length - 1)];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src}
      alt=""
      decoding="async"
      className={className}
      onError={() => {
        setI((prev) => {
          if (prev < candidates.length - 1) return prev + 1;
          onAllFailed?.();
          return prev;
        });
      }}
    />
  );
}

/**
 * Large stage: try `.mp4` first (poster = still), then still only. Backdrop is never a data gradient.
 */
export function CreatorAmbientStage({
  creatorId,
  posterSrc,
  videoSrc,
  bare = false,
  placeholder,
  className,
  children,
}: StageProps) {
  const poster = posterSrc ?? creatorPosterPath(creatorId);
  const video = videoSrc ?? creatorAmbientVideoPath(creatorId);

  const [phase, setPhase] = useState<"video" | "image" | "none">("video");

  useEffect(() => {
    setPhase("video");
  }, [creatorId, poster, video]);

  const showPlaceholder = phase === "none";

  return (
    <div className={cn("relative overflow-hidden", className)} style={{ backgroundColor: FALLBACK_BG }}>
      {phase === "video" && (
        <video
          key={video}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          src={video}
          poster={posterFallbackCandidates(poster)[0]}
          muted
          playsInline
          loop
          autoPlay
          onError={() => setPhase("image")}
        />
      )}
      {phase === "image" && (
        <PosterStack
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          onAllFailed={() => setPhase("none")}
        />
      )}

      {!showPlaceholder && !bare && (
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-black/65 via-transparent to-black/20" />
      )}

      {showPlaceholder && placeholder ? (
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center px-4">{placeholder}</div>
      ) : null}

      {children}
    </div>
  );
}

type WebrtcAmbientProps = {
  creatorId: string;
  posterSrc?: string;
  videoSrc?: string;
  hideAmbient: boolean;
  bare?: boolean;
  className?: string;
};

export function CreatorWebrtcAmbient({
  creatorId,
  posterSrc,
  videoSrc,
  hideAmbient,
  bare = false,
  className,
}: WebrtcAmbientProps) {
  if (hideAmbient) return null;

  const poster = posterSrc ?? creatorPosterPath(creatorId);
  const video = videoSrc ?? creatorAmbientVideoPath(creatorId);

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)} style={{ backgroundColor: FALLBACK_BG }}>
      <AmbientWebrtcInner key={`${creatorId}-${poster}-${video}`} poster={poster} video={video} bare={bare} />
    </div>
  );
}

function AmbientWebrtcInner({ poster, video, bare }: { poster: string; video: string; bare?: boolean }) {
  const [phase, setPhase] = useState<"video" | "image" | "none">("video");

  useEffect(() => {
    setPhase("video");
  }, [poster, video]);

  return (
    <>
      {phase === "video" && (
        <video
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          src={video}
          poster={posterFallbackCandidates(poster)[0]}
          muted
          playsInline
          loop
          autoPlay
          onError={() => setPhase("image")}
        />
      )}
      {phase === "image" && (
        <PosterStack
          poster={poster}
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          onAllFailed={() => setPhase("none")}
        />
      )}
      {phase !== "none" && !bare && <div className="absolute inset-0 bg-black/15 pointer-events-none" />}
    </>
  );
}
