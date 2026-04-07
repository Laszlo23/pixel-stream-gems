"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useAppPrivy } from "@/hooks/usePrivyCompat";
import { privyDisplayName } from "@/lib/privyDisplayName";

export interface LiveChatWireMessage {
  id: string;
  username: string;
  message: string;
  level: number;
  isSystem?: boolean;
}

type ServerMsg =
  | { type: "joined"; clientId: string }
  | { type: "chat-message"; clientId: string; displayName: string; text: string; ts: number }
  | { type: "error"; message: string };

/**
 * Real-time live room chat over the existing Gems signaling server (`kind=chat` channel).
 * Uses the same gate JWT as WebRTC so only admitted wallets can post.
 */
export function useLiveRoomChat(roomId: string) {
  const { address, isConnected } = useAccount();
  const { authenticated, ready, user } = useAppPrivy();
  const [remote, setRemote] = useState<LiveChatWireMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const gateBase = process.env.NEXT_PUBLIC_GATE_URL ?? "http://127.0.0.1:8787";
  const wsBase = process.env.NEXT_PUBLIC_SIGNALING_WS ?? "ws://127.0.0.1:4001";

  const displayName = privyDisplayName(user, address);

  useEffect(() => {
    if (!ready || !authenticated || !isConnected || !address) {
      setConnected(false);
      setRemote([]);
      wsRef.current?.close();
      wsRef.current = null;
      return;
    }

    let cancelled = false;
    const wsUrl = `${wsBase.replace(/\/$/, "")}?room=${encodeURIComponent(roomId)}&kind=chat`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    let token: string | null = null;

    const sendAuth = () => {
      if (cancelled || ws.readyState !== WebSocket.OPEN || !token) return;
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.addEventListener("open", sendAuth);

    void (async () => {
      try {
        const res = await fetch(`${gateBase}/v1/room-token`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ roomId, address }),
        });
        if (!res.ok) {
          const t = await res.text();
          throw new Error(t || "Could not join chat (gate)");
        }
        const j = (await res.json()) as { token: string };
        if (cancelled) return;
        token = j.token;
        sendAuth();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Chat connection failed");
      }
    })();

    ws.addEventListener("message", (ev) => {
      let data: ServerMsg;
      try {
        data = JSON.parse(String(ev.data)) as ServerMsg;
      } catch {
        return;
      }
      if (data.type === "joined") {
        setConnected(true);
        setError(null);
        return;
      }
      if (data.type === "error") {
        setError(data.message);
        return;
      }
      if (data.type === "chat-message") {
        setRemote((prev) => [
          ...prev,
          {
            id: `${data.ts}-${data.clientId}`,
            username: data.displayName,
            message: data.text,
            level: 1,
          },
        ]);
      }
    });

    ws.addEventListener("close", () => {
      setConnected(false);
      if (wsRef.current === ws) wsRef.current = null;
    });

    return () => {
      cancelled = true;
      ws.close();
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [ready, authenticated, isConnected, address, roomId, gateBase, wsBase]);

  const send = useCallback(
    (text: string) => {
      const ws = wsRef.current;
      if (ws?.readyState !== WebSocket.OPEN) return false;
      const trimmed = text.trim().slice(0, 500);
      if (!trimmed) return false;
      ws.send(JSON.stringify({ type: "chat", text: trimmed, displayName }));
      return true;
    },
    [displayName],
  );

  return { remote, connected, error, send, displayName };
}
