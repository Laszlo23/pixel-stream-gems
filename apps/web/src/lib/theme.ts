/**
 * TypeScript mirror of `src/styles/design-tokens.css` for inline styles, charts, or canvas.
 */
export const luxTheme = {
  colors: {
    primary: "#ff2b55",
    secondary: "#c4002f",
    background: "#070707",
    surface: "#111111",
    highlightGlow: "rgba(255,40,80,0.6)",
    foreground: "#f5f5f5",
    muted: "#888888",
  },
  gradients: {
    cta: "linear-gradient(135deg, #ff2b55 0%, #c4002f 48%, #ff4d6d 100%)",
    ctaHover: "linear-gradient(135deg, #ff3f66 0%, #d40035 50%, #ff6080 100%)",
  },
  radii: {
    button: 14,
    card: 16,
    panel: 18,
  },
  shadows: {
    glow: "0 0 36px rgba(255, 43, 85, 0.38)",
    glowLg: "0 0 56px rgba(255, 43, 85, 0.45)",
    soft: "0 16px 48px rgba(0, 0, 0, 0.72)",
  },
} as const;

export type LuxTheme = typeof luxTheme;
