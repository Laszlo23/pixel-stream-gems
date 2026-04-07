import type pg from "pg";

export type ComputeJobKind = "poster" | "loop";

export type EnqueueRenderJobInput = {
  roomId: string;
  kind: ComputeJobKind;
  prompt?: string;
};

/**
 * Enqueues a render/asset job for a background worker (cloud VPS or future 0G compute).
 * Workers should poll `compute_jobs` where status = 'queued', upload results to CDN/0G storage, then set result_url and status.
 */
export async function enqueueRenderJob(
  pool: pg.Pool | null,
  input: EnqueueRenderJobInput,
): Promise<{ id: string } | { error: string }> {
  if (!pool) {
    return { error: "database_unavailable" };
  }
  const prompt = input.prompt?.trim().slice(0, 2000) || null;
  try {
    const r = await pool.query<{ id: string }>(
      `INSERT INTO compute_jobs (room_id, kind, prompt, status)
       VALUES ($1, $2, $3, 'queued')
       RETURNING id::text AS id`,
      [input.roomId, input.kind, prompt],
    );
    const id = r.rows[0]?.id;
    if (!id) return { error: "insert_failed" };
    return { id };
  } catch (e) {
    console.warn("[jobs] enqueue failed", e);
    return { error: "insert_failed" };
  }
}
