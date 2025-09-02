"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase-browser";
import { getUserId } from "@/lib/navatar-client";
import CanonPicker from "@/components/CanonPicker";
import type { Canon } from "@/data/navatarCanons";
import "@/styles/navatar.css";

type Props = { open: boolean; onClose: () => void; onCreated: () => void };
type Mode = null | "upload" | "ai" | "canon";

export default function NavatarCreateModal({ open, onClose, onCreated }: Props) {
  const [mode, setMode] = useState<Mode>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function ensureUser() {
    const uid = await getUserId();
    if (!uid) throw new Error("Please sign in to create a Navatar.");
    return uid;
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const uid = await ensureUser();
      if (!file) throw new Error("Choose an image to upload.");
      const path = `${uid}/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw new Error(upErr.message);
      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const image_url = pub?.publicUrl;
      if (!image_url) throw new Error("Public URL not available");
      const { error: dbErr } = await supabase.from("avatars").insert({
        user_id: uid,
        name: name || file.name.replace(/\.[^.]+$/, ""),
        category: "upload",
        method: "upload",
        image_url,
        appearance_data: null,
      });
      if (dbErr) throw new Error(dbErr.message);
      onCreated();
      onClose();
      setName("");
      setFile(null);
    } catch (e: any) {
      setErr(e.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function onAI(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const uid = await ensureUser();
      if (!prompt.trim()) throw new Error("Describe your Navatar.");
      const res = await fetch("/.netlify/functions/generate-navatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, name, userId: uid }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Generation failed");
      onCreated();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function onCanonPick(c: Canon) {
    setErr(null);
    setLoading(true);
    try {
      const uid = await ensureUser();
      const { error } = await supabase.from("avatars").insert({
        user_id: uid,
        name: name || c.title,
        category: "canon",
        method: "canon",
        image_url: c.url,
        appearance_data: null,
      });
      if (error) throw new Error(error.message);
      onCreated();
      onClose();
      setName("");
    } catch (e: any) {
      setErr(e.message || "Could not save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Create Navatar</h3>
          <button onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-gray-100">
            ✕
          </button>
        </div>

        {mode === null && (
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", margin: "16px 0" }}>
            <button className="btn" onClick={() => setMode("upload")}>Upload</button>
            <button className="btn" onClick={() => setMode("ai")}>Describe &amp; Generate</button>
            <button className="btn" onClick={() => setMode("canon")}>Pick Canon</button>
          </div>
        )}

        {mode === "upload" && (
          <section className="create-block">
            <form onSubmit={handleUpload} className="space-y-3">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <button disabled={loading} className="btn">
                {loading ? "Saving…" : "Save"}
              </button>
            </form>
          </section>
        )}

        {mode === "ai" && (
          <section className="create-block">
            <form onSubmit={onAI} className="space-y-3">
              <input
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="h-28 w-full rounded-lg border px-3 py-2"
                placeholder="Describe your Navatar (e.g., half turtle, half durian…)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button disabled={loading} className="btn">
                {loading ? "Generating…" : "Generate"}
              </button>
            </form>
          </section>
        )}

        {mode === "canon" && (
          <section className="create-block">
            <CanonPicker onPick={onCanonPick} />
          </section>
        )}

        {mode && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <button
              className="btn-secondary"
              onClick={() => {
                setMode(null);
                setName("");
                setPrompt("");
                setFile(null);
              }}
            >
              Close
            </button>
          </div>
        )}

        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}

