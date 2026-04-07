const buckets = new Map<string, number[]>();

export function rateLimitAllow(key: string, maxPerWindow: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  const prev = buckets.get(key) ?? [];
  const recent = prev.filter((t) => t > windowStart);
  if (recent.length >= maxPerWindow) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  return true;
}
