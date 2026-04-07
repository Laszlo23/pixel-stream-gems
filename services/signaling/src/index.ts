import { createServer, type IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";
import { WebSocketServer, type WebSocket } from "ws";
import { jwtVerify } from "jose";

const PORT = Number(process.env.PORT ?? 4001);
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-jwt-secret-change-me");

type RoomKind = "webrtc" | "chat";

type Client = WebSocket & { clientId?: string; room?: string; authed?: boolean; kind?: RoomKind };

function parseConnection(req: IncomingMessage): { room: string; kind: RoomKind } {
  const u = new URL(req.url ?? "/", "http://localhost");
  const room = u.searchParams.get("room") ?? "default";
  const kind = u.searchParams.get("kind") === "chat" ? "chat" : "webrtc";
  return { room, kind };
}

const webrtcRooms = new Map<string, Map<string, Client>>();
const chatRooms = new Map<string, Map<string, Client>>();

function bucket(kind: RoomKind) {
  return kind === "chat" ? chatRooms : webrtcRooms;
}

function getRoomMap(kind: RoomKind, room: string) {
  const b = bucket(kind);
  let m = b.get(room);
  if (!m) {
    m = new Map();
    b.set(room, m);
  }
  return m;
}

function broadcastWebRtc(room: string, msg: object, except?: Client) {
  const m = webrtcRooms.get(room);
  if (!m) return;
  const payload = JSON.stringify(msg);
  for (const c of m.values()) {
    if (c !== except && c.readyState === 1) c.send(payload);
  }
}

function broadcastChat(room: string, msg: object) {
  const m = chatRooms.get(room);
  if (!m) return;
  const payload = JSON.stringify(msg);
  for (const c of m.values()) {
    if (c.readyState === 1) c.send(payload);
  }
}

function sendToWebRtc(room: string, targetId: string, msg: object) {
  const c = webrtcRooms.get(room)?.get(targetId);
  if (c?.readyState === 1) c.send(JSON.stringify(msg));
}

const server = createServer((_req, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  res.end("Gems signaling — use WebSocket\n");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: Client, req) => {
  const { room, kind } = parseConnection(req);
  ws.room = room;
  ws.kind = kind;

  ws.on("message", async (raw) => {
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(String(raw)) as Record<string, unknown>;
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    const type = data.type as string;

    if (type === "auth") {
      const token = data.token as string | undefined;
      if (!token) {
        ws.send(JSON.stringify({ type: "error", message: "Missing token" }));
        return;
      }
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const claimRoom = typeof payload.room === "string" ? payload.room : "";
        if (claimRoom !== room) {
          ws.send(JSON.stringify({ type: "error", message: "Token room mismatch" }));
          return;
        }
      } catch {
        ws.send(JSON.stringify({ type: "error", message: "Invalid token" }));
        return;
      }

      const clientId = randomUUID();
      ws.clientId = clientId;
      ws.authed = true;
      const m = getRoomMap(kind, room);

      if (kind === "webrtc") {
        const peers = [...m.keys()];
        m.set(clientId, ws);
        ws.send(JSON.stringify({ type: "joined", clientId, peers: [...peers, clientId] }));
        broadcastWebRtc(room, { type: "peer-joined", clientId }, ws);
      } else {
        m.set(clientId, ws);
        ws.send(JSON.stringify({ type: "joined", clientId }));
      }
      return;
    }

    if (!ws.authed || !ws.clientId) {
      ws.send(JSON.stringify({ type: "error", message: "Auth first" }));
      return;
    }

    if (type === "chat") {
      if (kind !== "chat") {
        ws.send(JSON.stringify({ type: "error", message: "Chat messages require kind=chat" }));
        return;
      }
      const text = String(data.text ?? "").trim().slice(0, 500);
      if (!text) return;
      const displayName = String(data.displayName ?? "Guest").trim().slice(0, 40);
      broadcastChat(room, {
        type: "chat-message",
        clientId: ws.clientId,
        displayName,
        text,
        ts: Date.now(),
      });
      return;
    }

    if (kind !== "webrtc") {
      ws.send(JSON.stringify({ type: "error", message: "Signaling only on WebRTC connections" }));
      return;
    }

    const target = data.target as string | undefined;
    if (!target) {
      ws.send(JSON.stringify({ type: "error", message: "Missing target" }));
      return;
    }

    if (type === "offer") {
      sendToWebRtc(room, target, { type: "offer", from: ws.clientId, sdp: data.sdp });
    } else if (type === "answer") {
      sendToWebRtc(room, target, { type: "answer", from: ws.clientId, sdp: data.sdp });
    } else if (type === "ice") {
      sendToWebRtc(room, target, { type: "ice", from: ws.clientId, candidate: data.candidate });
    }
  });

  ws.on("close", () => {
    if (!ws.clientId || !ws.room || !ws.kind) return;
    const m = getRoomMap(ws.kind, ws.room);
    m.delete(ws.clientId);
    if (m.size === 0) bucket(ws.kind).delete(ws.room!);
    else if (ws.kind === "webrtc") broadcastWebRtc(ws.room, { type: "peer-left", clientId: ws.clientId });
  });
});

server.listen(PORT, () => {
  console.info(`[signaling] ws://localhost:${PORT}?room=<id>[&kind=chat]`);
});
