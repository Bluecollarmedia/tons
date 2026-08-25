# Siren Board

A touch-friendly siren control board for the browser — 22 built-in siren
tones (Wail, Yelp, Hi-Lo, Phaser, Priority, Airhorn, and more), plus the
ability to upload your own siren sounds right on the page.

## Features

- **22 Regular Tones + 9 Dispatcher Tones + your Custom Tones**, switchable
  via tabs. Regular tones are vehicle-style sirens (Wail, Yelp, Hi-Lo,
  Phaser, Airhorn, ...); Dispatcher Tones are paging/alert tones (Two-Tone
  Page, Long Tone, Triple Beep, Digital Chirp, Station Horn, ...); Custom
  Tones is where your uploads live, with the upload control right there on
  the tab. All built-in tones are synthesized live with the Web Audio API
  — no audio files to download or host.
- **🎙️ Dispatch Loop**: hold the button to record a clip from the mic
  (walkie-talkie style — release to stop), e.g. "Dispatcher available,
  Monmouth County," and it loops continuously with Play/Pause and
  Discard controls. Boosted through its own gain + compressor so a
  normal-volume voice recording still cuts through layered siren tones.
  Fully independent of the siren engine — not touched by Stop All or the
  3-tone limit, so sirens trigger normally on top of it. Local to the
  current tab only (recorded to memory, never uploaded).
- **Tap to (re)trigger**: tap a tone to start it looping; tap it again
  anytime to restart it from the beginning. **Hold** a tone down to
  rapid-fire it (retriggers every ~150ms — "crazy fast") for as long as
  you hold it; release to stop it.
- **Up to 3 tones at once**, like a real siren box. Activating a fourth
  automatically stops the oldest one to make room.
- **2X SPEED** toggle to double the sweep/pulse rate (and playback rate for
  custom uploads) on whatever is currently playing — takes effect
  instantly, even mid-cycle.
- **Share and Download on every tile**, including custom uploads. Share
  renders the tone to a real audio clip and hands it to the device's
  native share sheet via the Web Share API — WhatsApp shows up there as
  one tap, since browsers can't push a file directly into a specific app
  for security reasons. If a browser doesn't support file sharing, it
  falls back to downloading automatically. The ⬇ button always just
  downloads the clip directly, no share sheet involved.
- **⚙ Reorder panel**: rearrange the buttons in each category (Regular,
  Dispatcher, Custom) by dragging the ⠿ handle, or with the up/down
  arrows. The order is saved per device (localStorage) and applies
  immediately to the live grid.
- **Upload your own siren — shared across every device**: on the Custom
  Tones tab, click "Add Custom Siren", pick an audio file and a name —
  it's added immediately, at the *top* of the list, and stored server-side
  (Netlify Blobs, via `netlify/functions/custom-tones.mjs`) so anyone who
  opens the site sees the same library, on any device. There are no
  accounts, so removing a tone removes it for everyone (a confirm prompt
  guards against a stray tap). This needs the app deployed on Netlify with
  functions enabled — see "Custom Tones backend" below.
- **Every upload is normalized to real audio before it's stored.** A
  browser tags a file by its container, not what's actually inside it — a
  voice-note-style `.mp4` comes back tagged `video/mp4`, and once that's
  the stored type, Share/Download inherit it too, so a share sheet treats
  it as a video. The app decodes whatever comes in (MP3, WAV, M4A, MP4,
  OGG, ...) with the Web Audio API and re-encodes it as WAV before
  uploading, so what's stored — and therefore every download, share, and
  playback — is always unambiguous audio. If a file can't be decoded at
  all, the upload is rejected with a clear message rather than silently
  storing something broken.
- Responsive grid layout, works on phone, tablet, and desktop. Header is a
  centered brand row (logo + title) with the controls (Reorder, 2X Speed,
  Volume, Stop All) in their own row below, rather than crammed together.
  No onboarding paragraph on the page — the two things worth knowing (tap
  to retrigger, hold to rapid-fire) are short labels right on the tiles
  instead.

## Running it

The board itself (the 22+9 built-in tones) is a static site — no build
step, no dependencies. Just serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

That's enough to try everything except Custom Tones, which needs the
backend below.

## Custom Tones backend

Custom Tones are a **shared library stored on the server**, not in the
browser — so the app now needs an actual backend, not just static files.
It's built as Netlify Functions + Netlify Blobs:

- `netlify/functions/custom-tones.mjs` — `GET` lists every custom tone's
  metadata, `POST` (multipart form: `file` + `name`) adds one, `DELETE
  ?id=...` removes one. Registered at `/api/custom-tones` via each
  function's exported `config.path`.
- `netlify/functions/custom-tone-audio.mjs` — streams the audio bytes for
  one tone (`GET /api/custom-tone-audio?id=...`), with a long-lived cache
  header since a given id's audio never changes.
- `netlify.toml` — points Netlify at `netlify/functions` and publishes the
  repo root.
- `package.json` — declares `@netlify/blobs` so Netlify's build installs
  it before bundling the functions.

**To deploy**: connect this GitHub repo to a Netlify site for continuous
deployment (Site settings → Build & deploy → Link repository, or "Import
an existing project" from Netlify's dashboard) so Netlify runs its own
build and picks up the functions automatically — Netlify Blobs needs zero
extra config when the functions actually run on Netlify. A plain static
drag-and-drop deploy (netlify.com/drop) only uploads files and does **not**
run the functions, so Custom Tones won't work that way.

**To test locally** without deploying, run the functions with the Netlify
CLI (emulates Blobs on disk, no login needed) alongside the static server:

```bash
npm install
npx netlify-cli functions:serve --offline --port 9999
```

Note this serves the functions on their own port — the app's `fetch("/api/...")`
calls expect same-origin, so exercising the full upload/list/delete flow
locally means proxying `/api/*` from your static server to port 9999 (or
using `netlify dev`, if your network allows its Edge Functions runtime
download — not required in production, since this app has no edge
functions).

## Android / PWA install

The site is a fully installable PWA: a complete manifest (`start_url`,
`scope`, `display: standalone`, 192/512 icons) plus a service worker
(`sw.js`) that caches the whole app shell for offline use — both required
for Chrome to consider a site "installable" at all. On Android, Chrome
decides on its own when to surface the automatic "Add to Home screen"
banner (based on its own engagement heuristics — this isn't something a
site can force to appear on the very first visit), but the page also adds
its own **📲 Install App** button that appears the moment Chrome confirms
the site is eligible (listening for `beforeinstallprompt`), so there's
always a user-triggerable install path even if the automatic banner
hasn't shown up yet. **Important**: installability requires HTTPS (or
`localhost`) — it won't activate over plain `http://` on a real domain.

## iOS notes

- **Playback reliability**: audio now waits for the `AudioContext` to
  actually be running before scheduling anything (`ensureRunning()`),
  instead of firing `resume()` and scheduling immediately. The old
  behavior was a real bug — it could schedule tones against a still-frozen
  clock, especially right after the tab was backgrounded or the phone was
  locked, and silently produce nothing.
- **Ringer/silent switch**: iOS plays web audio under the "ambient" session
  category by default, which is muted whenever the phone's silent switch
  is on — this is a deliberate platform restriction, not something a
  website can normally override. `unlock.mp4` (a ~1.5KB silent, looping,
  muted `<video>`) is a long-standing, unofficial community workaround
  that can nudge Safari into a session category that ignores the switch.
  It's best-effort: harmless if it doesn't help (fails silently), but not
  guaranteed across all iOS/Safari versions.

## Files

- `index.html` — page structure
- `style.css` — theme and layout
- `app.js` — audio engine (siren synthesis, custom upload storage, UI wiring)
- `unlock.mp4` — silent looping video used for the iOS ringer-switch workaround
- `sw.js` — service worker: caches the app shell for offline use and PWA installability
- `manifest.webmanifest` — PWA manifest (name, icons, start_url, display mode)
- `netlify/functions/custom-tones.mjs` — shared Custom Tones API (list/upload/delete)
- `netlify/functions/custom-tone-audio.mjs` — streams one custom tone's audio bytes
- `netlify.toml`, `package.json` — Netlify build config and the `@netlify/blobs` dependency
