import { getStore } from "@netlify/blobs";

export default async (req) => {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return new Response("Missing id", { status: 400 });

  const store = getStore("custom-tones");
  const [meta, audio] = await Promise.all([
    store.get(`meta/${id}`, { type: "json" }),
    store.get(`audio/${id}`, { type: "arrayBuffer" }),
  ]);
  if (!audio) return new Response("Not found", { status: 404 });

  return new Response(audio, {
    headers: {
      "Content-Type": meta?.type || "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export const config = { path: "/api/custom-tone-audio" };
