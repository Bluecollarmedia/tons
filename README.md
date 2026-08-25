# Siren Board

A touch-friendly siren control board for the browser — 22 built-in siren
tones (Wail, Yelp, Hi-Lo, Phaser, Priority, Airhorn, and more), plus the
ability to upload your own siren sounds right on the page.

## Features

- **22 built-in siren tones**, synthesized live with the Web Audio API — no
  audio files to download or host.
- **Tap to toggle**: tap a siren to start it looping, tap again to stop it.
- **Up to 2 sirens at once**, like a real police siren box. Activating a
  third automatically stops the oldest one to make room.
- **2X SPEED** toggle to double the sweep rate (and playback rate for
  custom uploads) on whatever is currently playing.
- **Upload your own siren**: click "Add Custom Siren", pick an audio file
  and a name, and it's added to the board immediately. Custom sirens are
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

## Files

- `index.html` — page structure
- `style.css` — theme and layout
- `app.js` — audio engine (siren synthesis, custom upload storage, UI wiring)
