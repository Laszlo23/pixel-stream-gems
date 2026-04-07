const XAI_URL = "https://api.x.ai/v1/chat/completions";

export async function grokChatCompletion(params: {
  apiKey: string;
  model: string;
  system: string;
  user: string;
}): Promise<string | null> {
  const { apiKey, model, system, user } = params;
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(XAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        max_tokens: 120,
        temperature: 0.75,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      console.warn("[grok] non-OK", res.status, await res.text().catch(() => ""));
      return null;
    }
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content ?? null;
  } catch (e) {
    console.warn("[grok] request failed", e instanceof Error ? e.message : e);
    return null;
  } finally {
    clearTimeout(t);
  }
}
