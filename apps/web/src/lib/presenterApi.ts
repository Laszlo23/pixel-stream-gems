const PRESENTER_PATH = "/v1/rooms";

function apiBase(): string | null {
  const u = process.env.NEXT_PUBLIC_API_URL?.trim();
  return u && u.length > 0 ? u.replace(/\/$/, "") : null;
}

export function isPresenterApiConfigured(): boolean {
  return apiBase() !== null;
}

export async function fetchPresenterLines(
  roomId: string,
  body: {
    userMessage?: string;
    idle?: boolean;
    personaName?: string;
    streamCategory?: string;
    /** When API has PRESENTER_REQUIRE_ASM_PURCHASE=1, include a SIWE message + signature */
    siweMessage?: string;
    siweSignature?: string;
  },
): Promise<string[]> {
  const base = apiBase();
  if (!base) return [];
  const url = `${base}${PRESENTER_PATH}/${encodeURIComponent(roomId)}/presenter-reply`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { lines?: string[] };
  return Array.isArray(data.lines) ? data.lines.filter((x) => typeof x === "string" && x.trim()) : [];
}

export const PRESENTER_BOT_USERNAME = "Presenter AI";
