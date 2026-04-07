# WebRTC TURN (production)

Browser WebRTC needs a **TURN** server when peers are behind symmetric NAT or strict firewalls. STUN alone is not enough for many mobile networks.

## Options

1. **Cloudflare Realtime TURN** — managed credentials, good for pilots.
2. **coturn** — self-hosted on a small VPS; configure `realm`, `static-auth-secret`, and TLS.
3. **Twilio / Metered.ca** — hosted TURN with usage-based pricing.

## Gems app configuration

Set `NEXT_PUBLIC_TURN_JSON` in `apps/web` to a JSON array of `RTCIceServer` objects, for example:

```json
[
  {
    "urls": "turn:turn.example.com:3478",
    "username": "user",
    "credential": "pass"
  }
]
```

The `WebRtcRoom` component merges this with the public Google STUN server used for local development.

Never commit real TURN credentials; use environment injection in CI and hosting.
