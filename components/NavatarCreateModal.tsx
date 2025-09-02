'use client';
import React, { useMemo, useState } from 'react';
import { supabase, uploadToStorage, createAvatarRow, publicCanonOptions } from '@/lib/navatar';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void; // refresh list callback
};

type Tab = 'upload' | 'ai' | 'canon';

export default function NavatarCreateModal({ open, onClose, onCreated }: Props) {
  const [tab, setTab] = useState<Tab>('upload');

  // upload
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('avatar');

  // ai
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState<string | null>(null);

  // canon
  const canon = useMemo(() => publicCanonOptions(), []);

  if (!open) return null;

  async function ensureUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Please sign in to create a Navatar.');
    return user.id;
  }

  async function handleUploadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userId = await ensureUser();
      if (!file) throw new Error('Choose an image to upload');

      const { path, publicUrl } = await uploadToStorage(file, userId);
      await createAvatarRow({
        name: name || file.name.replace(/\.[^.]+$/, ''),
        category,
        method: 'upload',
        image_url: publicUrl,
        image_path: path,
        status: 'ready',
      });

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const userId = await ensureUser();
      if (!prompt.trim()) throw new Error('Describe your Navatar');

      const res = await fetch('/.netlify/functions/navatar-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Generation failed');
      }
      const { base64, mime } = (await res.json()) as { base64: string; mime: string };

      // turn base64 to File
      const bin = atob(base64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      const blob = new Blob([arr], { type: mime || 'image/png' });
      const genFile = new File([blob], 'navatar.png', { type: mime || 'image/png' });

      const { path, publicUrl } = await uploadToStorage(genFile, userId);
      await createAvatarRow({
        name: name || 'My Navatar',
        category,
        method: 'ai',
        image_url: publicUrl,
        image_path: path,
        status: 'ready',
      });

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleCanonPick(url: string) {
    setLoading(true);
    setError(null);
    try {
      await ensureUser();
      await createAvatarRow({
        name: name || 'Canon Navatar',
        category,
        method: 'canon',
        image_url: url,
        image_path: null,
        status: 'ready',
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Could not add canon Navatar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Create Navatar</h3>
          <button onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-gray-100">
            ✕
          </button>
        </div>

        <div className="mb-4 flex gap-2">
          {(['upload', 'ai', 'canon'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1 text-sm ${
                tab === t ? 'bg-blue-600 text-white' : 'bg-gray-100'
              }`}
            >
              {t === 'upload' ? 'Upload' : t === 'ai' ? 'Describe & Generate' : 'Pick Canon'}
            </button>
          ))}
        </div>

        {tab === 'upload' && (
          <form onSubmit={handleUploadSubmit} className="space-y-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <button disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              {loading ? 'Saving…' : 'Save'}
            </button>
          </form>
        )}

        {tab === 'ai' && (
          <form onSubmit={handleAiSubmit} className="space-y-3">
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <textarea
              className="h-28 w-full rounded-lg border px-3 py-2"
              placeholder="Describe your Navatar (e.g., 'half turtle, half durian, friendly, vibrant shells…')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </form>
        )}

        {tab === 'canon' && (
          <div className="space-y-3">
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              placeholder="Category (optional)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
              {canon.map((c) => (
                <button
                  key={c.key}
                  onClick={() => handleCanonPick(c.url)}
                  className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50"
                >
                  <img src={c.url} className="h-10 w-10" alt={c.label} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
      </div>
    </div>
  );
}

