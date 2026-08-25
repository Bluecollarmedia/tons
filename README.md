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
- **Upload your own siren**: on the Custom Tones tab, click "Add Custom
  Siren", pick an audio file and a name — it's added immediately, at the
  *top* of your custom list (not buried at the bottom). Custom sirens are
  saved in the browser (IndexedDB) so they're still there next time you
  open the page on the same device. Nothing is uploaded to a server.
- Responsive grid layout, works on phone, tablet, and desktop.

## Running it

No build step, no dependencies. Just serve the folder statically:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

or open `index.html` directly in a browser (uploads still work via
IndexedDB; some browsers are stricter about `file://` audio autoplay, so a
local server is recommended).

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
