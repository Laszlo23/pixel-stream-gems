/** Used when Postgres is unavailable or `chat_phrases` is empty. */
export const FALLBACK_CHAT_PHRASES: { category: string; text: string }[] = [
  { category: "greeting", text: "Hey — welcome in! Glad you made it." },
  { category: "greeting", text: "Hi everyone, good energy in here tonight." },
  { category: "filler", text: "We are keeping things chill and on-topic." },
  { category: "filler", text: "Love the vibes — thanks for hanging out." },
  { category: "hype", text: "Let us gooo — stack those reactions." },
  { category: "question", text: "What should we queue next — music, games, or Q&A?" },
  { category: "question", text: "Anyone here for the first time tonight?" },
];

export function sampleFallbackPhrases(count: number): string[] {
  const shuffled = [...FALLBACK_CHAT_PHRASES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((p) => p.text);
}
