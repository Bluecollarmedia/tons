import { getStore } from "@netlify/blobs";

// A shared library: every visitor sees the same custom tones, no accounts.
// Metadata lives at meta/<id>, the audio bytes at audio/<id>, in the same
// Netlify Blobs store.
const STORE_NAME = "custom-tones";
const MAX_BYTES = 5 * 1024 * 1024;

export default async (req) => {
  const store = getStore(STORE_NAME);

  if (req.method === "GET") {
    const { blobs } = await store.list({ prefix: "meta/" });
    const tones = await Promise.all(blobs.map((b) => store.get(b.key, { type: "json" })));
    tones.sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0));
    return Response.json(tones.filter(Boolean));
  }

  if (req.method === "POST") {
    let form;
    try {
      form = await req.formData();
    } catch {
      return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }
    const file = form.get("file");
    const name = (form.get("name") || "Custom Siren").toString().trim().slice(0, 60) || "Custom Siren";
    if (!file || typeof file === "string") {
      return Response.json({ error: "Missing audio file" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ error: "File too large (max 5MB)" }, { status: 413 });
    }

    const id = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const buffer = await file.arrayBuffer();
    await store.set(`audio/${id}`, buffer);
    const meta = { id, name, type: file.type || "audio/mpeg", createdAt: Date.now() };
    await store.setJSON(`meta/${id}`, meta);
    return Response.json(meta, { status: 201 });
  }

  if (req.method === "DELETE") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    await Promise.all([store.delete(`audio/${id}`), store.delete(`meta/${id}`)]);
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/custom-tones" };
