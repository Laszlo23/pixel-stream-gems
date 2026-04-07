import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApiApp } from "./createApiApp.js";

describe("createApiApp (no database)", () => {
  const app = createApiApp({ pool: null });

  it("GET /health returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("GET /v1/competitions returns seed payload shape", async () => {
    const res = await request(app).get("/v1/competitions");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.TOP_TIPPING_FANS)).toBe(true);
    expect(res.body.COMPETITION_REWARDS).toBeDefined();
  });

  it("POST /v1/rooms/:roomId/presenter-reply with idle returns lines", async () => {
    const res = await request(app).post("/v1/rooms/demo/presenter-reply").send({ idle: true });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.lines)).toBe(true);
    expect(res.body.lines.length).toBeGreaterThan(0);
    for (const line of res.body.lines) {
      expect(typeof line).toBe("string");
    }
  });
});
