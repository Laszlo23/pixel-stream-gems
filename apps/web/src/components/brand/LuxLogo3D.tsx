"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/** Animated mark — glossy 3D-style gem without external assets. */
export function LuxLogo3D({ className, size = "lg" }: { className?: string; size?: "md" | "lg" | "xl" }) {
  const dim = size === "xl" ? "w-40 h-40 md:w-52 md:h-52" : size === "lg" ? "w-32 h-32 md:w-44 md:h-44" : "w-24 h-24";

  return (
    <div className={cn("relative mx-auto [perspective:640px]", className)}>
      <div
        className={cn(
          "relative animate-lux-logo [transform-style:preserve-3d]",
          dim,
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-[1.35rem] border border-white/10",
            "bg-gradient-to-br from-[#ff2b55] via-[#c4002f] to-[#1a0206]",
            "shadow-lux-lg",
          )}
          style={{
            boxShadow:
              "0 24px 48px rgba(0,0,0,0.65), 0 0 60px rgba(255,43,85,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        />
        <div
          className="absolute inset-[10%] rounded-2xl bg-gradient-to-tr from-white/25 via-transparent to-transparent opacity-90 pointer-events-none"
          style={{ transform: "translateZ(12px)" }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center rounded-[1.35rem] pointer-events-none"
          style={{ transform: "translateZ(24px)" }}
        >
          <Sparkles className="w-[42%] h-[42%] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" strokeWidth={1.5} />
        </div>
        <div
          className="absolute -inset-1 rounded-[1.5rem] opacity-60 blur-xl bg-[#ff2b55] -z-10 animate-lux-pulse-glow"
          aria-hidden
        />
      </div>
    </div>
  );
}
