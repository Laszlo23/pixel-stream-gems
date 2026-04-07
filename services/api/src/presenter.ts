import type pg from "pg";
import { sampleFallbackPhrases } from "./fallbackPhrases.js";
import { grokChatCompletion } from "./grok.js";
import { moderatePresenterLine } from "./moderate.js";
import { isZeroGInferenceConfigured, zerogChatCompletion } from "./zerogInference.js";

export type PresenterLlmBackend = "zerog" | "xai" | "none";

/** Prefer 0G when configured and mode allows; else xAI when key set. */
export function resolvePresenterLlm(): PresenterLlmBackend {
  const mode = (process.env.PRESENTER_LLM ?? "auto").trim().toLowerCase();
  const zgOk = isZeroGInferenceConfigured();
  const xaiOk = Boolean(process.env.XAI_API_KEY?.trim());

  if (mode === "zerog") return zgOk ? "zerog" : "none";
  if (mode === "xai") return xaiOk ? "xai" : "none";
  if (zgOk) return "zerog";
  if (xaiOk) return "xai";
  return "none";
}

async function samplePhrasesFromDb(pool: pg.Pool, roomId: string, count: number): Promise<string[]> {
  const r = await pool.query<{ text: string }>(
    `SELECT text FROM chat_phrases
     WHERE room_id IS NULL OR room_id = $1
     ORDER BY -ln(random()) / GREATEST(weight, 1)
     LIMIT $2`,
    [roomId, count],
  );
  return r.rows.map((row) => row.text);
}

export type PresenterRequestBody = {
  userMessage?: string;
  personaName?: string;
  streamCategory?: string;
  idle?: boolean;
  /** When PRESENTER_REQUIRE_ASM_PURCHASE=1, SIWE proving wallet for AgentSkillMarket.purchases check */
  siweMessage?: string;
  siweSignature?: string;
};

export async function buildPresenterLines(params: {
  pool: pg.Pool | null;
  roomId: string;
  body: PresenterRequestBody;
}): Promise<string[]> {
  const { pool, roomId, body } = params;
  const persona = body.personaName?.trim() || "the host";
  const category = body.streamCategory?.trim() || "live stream";
  const userMsg = typeof body.userMessage === "string" ? body.userMessage.trim() : "";
  const idle = Boolean(body.idle);

  const llm = resolvePresenterLlm();
  const hasLlm = llm !== "none";
  const cannedTarget = idle ? 2 : userMsg ? (hasLlm ? 1 : 2) : 2;
  let canned: string[] = [];
  if (pool) {
    try {
      canned = await samplePhrasesFromDb(pool, roomId, cannedTarget);
    } catch (e) {
      console.warn("[presenter] db sample failed", e);
    }
  }
  if (canned.length < cannedTarget) {
    const need = cannedTarget - canned.length;
    const fb = sampleFallbackPhrases(need + 2).filter((t) => !canned.includes(t));
    canned = [...canned, ...fb.slice(0, need)];
  }

  const lines: string[] = [];
  const pushLine = (t: string | null | undefined) => {
    if (!t) return;
    const m = moderatePresenterLine(t);
    if (m) lines.push(m);
  };

  if (userMsg && !idle) {
    pushLine(canned[0]);
    const system = [
      `You are a friendly room assistant for ${persona}'s ${category} on a moderated creator platform.`,
      "Replies must be one or two short sentences, PG-rated, no adult services, no medical or legal claims, no URLs.",
      "Match the viewer's energy; be welcoming and concise.",
    ].join(" ");
    const user = `Viewer said: "${userMsg.slice(0, 500)}"\nReply as the room assistant.`;

    if (llm === "zerog") {
      const z = await zerogChatCompletion({ system, user });
      pushLine(z);
    } else if (llm === "xai") {
      const apiKey = process.env.XAI_API_KEY ?? "";
      const model = process.env.XAI_MODEL ?? "grok-2-latest";
      const g = await grokChatCompletion({ apiKey, model, system, user });
      pushLine(g);
    } else {
      pushLine(canned[1]);
    }
  } else {
    for (const c of canned.slice(0, 2)) pushLine(c);
  }

  return lines.slice(0, 4);
}
