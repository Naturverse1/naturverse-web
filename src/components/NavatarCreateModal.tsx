'use client';
import React, { useState } from 'react';
import { createAvatarRow, uploadToStorage, getUserId } from '@/lib/navatar-client';
import CanonPicker from '@/components/CanonPicker';
import { canonSrc, type Canon } from '@/lib/canon';

type Props = { open: boolean; onClose: () => void; onCreated: () => void; };
type Tab = 'upload' | 'ai' | 'canon';

export default function NavatarCreateModal({ open, onClose, onCreated }: Props) {
  const [tab, setTab] = useState<Tab>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('avatar');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function ensureUser() {
    const uid = await getUserId();
    if (!uid) throw new Error('Please sign in to create a Navatar.');
    return uid;
  }

  async function onUpload(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setLoading(true);
    try {
      const uid = await ensureUser();
      if (!file) throw new Error('Choose an image to upload.');
      const { publicUrl } = await uploadToStorage(file, uid);
      await createAvatarRow({ name: name || file.name.replace(/\.[^.]+$/, ''), category, image_url: publicUrl, method: 'upload' });
      onCreated(); onClose();
    } catch (e:any) { setErr(e.message || 'Upload failed'); } finally { setLoading(false); }
  }

  async function onAI(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setLoading(true);
    try {
      const uid = await ensureUser();
      if (!prompt.trim()) throw new Error('Describe your Navatar.');
      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: uid,
          name: name || undefined,
          prompt,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Generation failed');
      onCreated(); onClose();
    } catch (e:any) { setErr(e.message || 'Generation failed'); } finally { setLoading(false); }
  }

  async function onCanonPick(c: Canon) {
    setErr(null); setLoading(true);
    try {
      await ensureUser();
      const url = canonSrc(c.file);
      await createAvatarRow({ name: name || c.title, category, image_url: url, method: 'canon' });
      onCreated(); onClose();
    } catch (e:any) { setErr(e.message || 'Could not save'); } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-3">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Create Navatar</h3>
          <button onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-gray-100">✕</button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <button onClick={()=>setTab('upload')} className={`rounded-full px-3 py-2 text-sm ${tab==='upload'?'bg-blue-600 text-white':'bg-gray-100'}`}>Upload</button>
          <button onClick={()=>setTab('ai')}     className={`rounded-full px-3 py-2 text-sm ${tab==='ai'    ?'bg-blue-600 text-white':'bg-gray-100'}`}>Describe & Generate</button>
          <button onClick={()=>setTab('canon')}  className={`rounded-full px-3 py-2 text-sm ${tab==='canon' ?'bg-blue-600 text-white':'bg-gray-100'}`}>Pick Canon</button>
        </div>

        <div className="space-y-3">
          <input className="w-full rounded-lg border px-3 py-2" placeholder="Name (optional)" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full rounded-lg border px-3 py-2" placeholder="Category (optional)" value={category} onChange={(e)=>setCategory(e.target.value)} />
        </div>

        <div className="mt-4">
          {tab==='upload' && (
            <form onSubmit={onUpload} className="space-y-3">
              <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
              <button disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white">{loading?'Saving…':'Save'}</button>
            </form>
          )}
          {tab==='ai' && (
            <form onSubmit={onAI} className="space-y-3">
              <textarea className="h-28 w-full rounded-lg border px-3 py-2" placeholder="Describe your Navatar (e.g., half turtle, half durian…)" value={prompt} onChange={(e)=>setPrompt(e.target.value)} />
              <button disabled={loading} className="rounded-lg bg-blue-600 px-4 py-2 text-white">{loading?'Generating…':'Generate'}</button>
            </form>
          )}
          {tab==='canon' && <CanonPicker onPick={onCanonPick} />}
        </div>

        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      </div>
    </div>
  );
}

