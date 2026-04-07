"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Video, VideoOff, Radio } from "lucide-react";
import { CreatorWebrtcAmbient } from "@/components/creator/CreatorPublicMedia";

type SignalMsg =
  | { type: "joined"; clientId: string; peers: string[] }
  | { type: "peer-joined"; clientId: string }
  | { type: "peer-left"; clientId: string }
  | { type: "offer"; from: string; sdp: string }
  | { type: "answer"; from: string; sdp: string }
  | { type: "ice"; from: string; candidate: RTCIceCandidateInit }
  | { type: "error"; message: string };

const DEFAULT_ICE: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];

function iceServers(): RTCIceServer[] {
  const raw = process.env.NEXT_PUBLIC_TURN_JSON;
  if (!raw) return DEFAULT_ICE;
  try {
    const extra: unknown = JSON.parse(raw);
    return [...DEFAULT_ICE, ...(Array.isArray(extra) ? (extra as RTCIceServer[]) : [])];
  } catch {
    return DEFAULT_ICE;
  }
}

export interface WebRtcRoomProps {
  roomId: string;
  isPublisher: boolean;
  className?: string;
  /** Show `public/camgirls/{id}` poster + optional mp4 until WebRTC is live. */
  ambientCreator?: {
    creatorId: string;
    posterSrc?: string;
    videoSrc?: string;
    /** No dim overlay on poster/video */
    bare?: boolean;
  };
}

export function WebRtcRoom({ roomId, isPublisher, className, ambientCreator }: WebRtcRoomProps) {
  const { address } = useAccount();
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const selfIdRef = useRef<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "live" | "error">("idle");
  const [mutedNote, setMutedNote] = useState<string | null>(null);

  const gateBase = process.env.NEXT_PUBLIC_GATE_URL ?? "http://127.0.0.1:8787";
  const wsBase = process.env.NEXT_PUBLIC_SIGNALING_WS ?? "ws://127.0.0.1:4001";

  const cleanupPeer = useCallback(() => {
    pcRef.current?.close();
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const sendSignal = useCallback((msg: object) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  }, []);

  const fetchToken = useCallback(async () => {
    if (!address) throw new Error("Wallet not connected");
    const res = await fetch(`${gateBase}/v1/room-token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ roomId, address }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(t || "Gate denied admission");
    }
    const j = (await res.json()) as { token: string };
    return j.token;
  }, [address, gateBase, roomId]);

  const ensurePc = useCallback(
    (remoteId: string) => {
      if (pcRef.current) return pcRef.current;
      const pc = new RTCPeerConnection({ iceServers: iceServers() });
      pc.onicecandidate = (ev) => {
        if (ev.candidate) sendSignal({ type: "ice", target: remoteId, candidate: ev.candidate.toJSON() });
      };
      pc.ontrack = (ev) => {
        if (videoRef.current && ev.streams[0]) videoRef.current.srcObject = ev.streams[0];
      };
      pcRef.current = pc;
      return pc;
    },
    [sendSignal],
  );

  const publishTo = useCallback(
    async (remoteId: string) => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      const pc = ensurePc(remoteId);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendSignal({ type: "offer", target: remoteId, sdp: offer.sdp ?? "" });
      setStatus("live");
    },
    [ensurePc, sendSignal],
  );

  const prepViewer = useCallback(
    (remoteId: string) => {
      const pc = ensurePc(remoteId);
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });
    },
    [ensurePc],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!address) {
        setMutedNote("Connect a wallet to join the gated WebRTC room.");
        return;
      }
      setStatus("connecting");
      try {
        const token = await fetchToken();
        if (cancelled) return;
        const wsUrl = `${wsBase.replace(/\/$/, "")}?room=${encodeURIComponent(roomId)}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        ws.onopen = () => ws.send(JSON.stringify({ type: "auth", token }));
        ws.onmessage = async (ev) => {
          let msg: SignalMsg;
          try {
            msg = JSON.parse(String(ev.data)) as SignalMsg;
          } catch {
            return;
          }
          if (!msg || typeof msg !== "object" || !("type" in msg)) return;
          if (msg.type === "error") {
            toast.error(msg.message);
            setStatus("error");
            return;
          }
          if (msg.type === "joined") {
            selfIdRef.current = msg.clientId;
            const peers = Array.isArray(msg.peers) ? msg.peers : [];
            const others = peers.filter((p) => p !== msg.clientId);
            if (others[0]) {
              const remote = others[0];
              if (isPublisher) await publishTo(remote);
              else prepViewer(remote);
            }
            return;
          }
          if (msg.type === "peer-joined") {
            if (msg.clientId === selfIdRef.current) return;
            if (isPublisher) await publishTo(msg.clientId);
            else prepViewer(msg.clientId);
            return;
          }
          if (msg.type === "peer-left") {
            cleanupPeer();
            setStatus("connecting");
            return;
          }
          if (msg.type === "offer" && !isPublisher) {
            const pc = ensurePc(msg.from);
            await pc.setRemoteDescription({ type: "offer", sdp: msg.sdp });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            sendSignal({ type: "answer", target: msg.from, sdp: answer.sdp ?? "" });
            setStatus("live");
            return;
          }
          if (msg.type === "answer" && isPublisher) {
            if (pcRef.current) await pcRef.current.setRemoteDescription({ type: "answer", sdp: msg.sdp });
            return;
          }
          if (msg.type === "ice") {
            if (pcRef.current && msg.candidate?.candidate) {
              try {
                await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate));
              } catch {
                /* ignore */
              }
            }
          }
        };
        ws.onerror = () => {
          setStatus("error");
          setMutedNote("Signaling failed. Run services/gate and services/signaling (see repo README).");
        };
      } catch (e) {
        setStatus("error");
        setMutedNote(e instanceof Error ? e.message : "Could not join room");
      }
    })();
    return () => {
      cancelled = true;
      wsRef.current?.close();
      cleanupPeer();
    };
  }, [
    address,
    cleanupPeer,
    fetchToken,
    isPublisher,
    prepViewer,
    publishTo,
    roomId,
    sendSignal,
    ensurePc,
    wsBase,
  ]);

  return (
    <div className={cn("rounded-2xl border border-border/80 bg-black/40 overflow-hidden", className)}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-card/40">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">WebRTC</span>
          <Badge variant="outline" className="text-[10px] rounded-md font-mono">
            {status}
          </Badge>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="h-7 text-[10px] rounded-lg"
          onClick={() => {
            cleanupPeer();
            setStatus("idle");
            toast.message("Reset player", { description: "Reload the page to reconnect." });
          }}
        >
          Reset
        </Button>
      </div>
      <div className="relative aspect-video flex items-center justify-center overflow-hidden bg-[#0A0A0A]">
        {ambientCreator && (
          <CreatorWebrtcAmbient
            creatorId={ambientCreator.creatorId}
            posterSrc={ambientCreator.posterSrc}
            videoSrc={ambientCreator.videoSrc}
            bare={ambientCreator.bare}
            hideAmbient={status === "live"}
          />
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isPublisher}
          className={cn(
            "absolute inset-0 w-full h-full object-cover z-[1]",
            status !== "live" && "pointer-events-none",
          )}
        />
        {status !== "live" && (
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center text-center px-4 bg-black/10">
            {status === "connecting" ? (
              <Video className="w-10 h-10 text-muted-foreground mx-auto mb-2 animate-pulse" />
            ) : (
              <VideoOff className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            )}
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              {mutedNote ?? (isPublisher ? "Publishing when a viewer joins…" : "Waiting for creator stream…")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
