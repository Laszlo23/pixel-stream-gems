Creator stills (primary)
========================

Each streamer in `src/data/streamers.ts` uses **`thumbnailImage`**, e.g. `/camgirls/camgirl1.jpg` … `/camgirls/camgirl9.jpg`, for:

- Home tiles, discover cards, live room poster, profile header & avatar (same file, `object-cover` per layout).

Optional extra assets **`camgirl10.jpg`–`camgirl18.jpg`** are available for more creators or future rows — wire them by setting `thumbnailImage` on new `STREAMERS` entries.

Ambient video (until WebRTC)
==============================

Still uses **`preview-{NN}-loop.mp4`** per `previewSlot` (`01`…`09`), unless `ambientVideo` is set on the streamer.

Fallback stills (if `thumbnailImage` is removed)
================================================

  preview-{NN}-16x9.{ext}   — wide layouts
  preview-{NN}-portrait.{ext} — tall layouts

Extensions: `PREVIEW_SLOT_EXT` in `streamers.ts` (defaults to `.jpg` per slot).

Legacy files can remain in this folder; the app resolves `/camgirls/camgirl*.jpg` first when configured.
