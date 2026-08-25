import { getStore } from "@netlify/blobs";

// iOS Safari requires HTTP Range support to reliably play <audio>/<video>
// served from a URL — without it, playback can silently fail or hang,
// especially on anything beyond a trivially small file. Built-in tones
// never hit this (they're pure Web Audio oscillators, not fetched over
// HTTP); every custom upload does, since it streams from here.
export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const store = getStore("custom-tones");
  const [meta, audio] = await Promise.all([
    store.get(`meta/${id}`, { type: "json" }),
    store.get(`audio/${id}`, { type: "arrayBuffer" }),
  ]);
  if (!audio) return new Response("Not found", { status: 404 });

  const contentType = meta?.type || "audio/mpeg";
  const totalSize = audio.byteLength;
  const baseHeaders = {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  const range = req.headers.get("range");
  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    if (match) {
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? parseInt(match[2], 10) : totalSize - 1;
      const clampedStart = Number.isNaN(start) || start < 0 ? 0 : start;
      const clampedEnd = Number.isNaN(end) || end > totalSize - 1 ? totalSize - 1 : end;

      if (clampedStart > clampedEnd || clampedStart >= totalSize) {
        return new Response(null, {
          status: 416,
          headers: { ...baseHeaders, "Content-Range": `bytes */${totalSize}` },
        });
      }

      const chunk = audio.slice(clampedStart, clampedEnd + 1);
      return new Response(chunk, {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Range": `bytes ${clampedStart}-${clampedEnd}/${totalSize}`,
          "Content-Length": String(chunk.byteLength),
        },
      });
    }
  }

  return new Response(audio, {
    status: 200,
    headers: { ...baseHeaders, "Content-Length": String(totalSize) },
  });
};

export const config = { path: "/api/custom-tone-audio" };
