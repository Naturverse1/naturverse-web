import React, { useState } from 'react';
import CanonPicker from './CanonPicker';
import { createNavatar, generateImageFromPrompt, Navatar } from '@/lib/navatar';

interface Props {
  onClose: () => void;
  onSaved: () => void;
  initial?: Navatar | null;
}

export default function NavatarForm({ onClose, onSaved, initial }: Props) {
  const [tab, setTab] = useState<'upload' | 'ai' | 'canon'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState(initial?.name || '');
  const [category, setCategory] = useState(initial?.category || '');
  const [description, setDescription] = useState('');
  const [generated, setGenerated] = useState<string>('');

  async function saveUpload() {
    if (!file) return;
    await createNavatar({ method: 'upload', imageFileOrUrl: file, name, category, traits: {} });
    onSaved();
  }

  async function generate() {
    const b64 = await generateImageFromPrompt({ name, category }, description);
    if (b64) setGenerated(`data:image/png;base64,${b64}`);
  }

  async function saveAi() {
    if (!generated) return;
    await createNavatar({ method: 'ai', imageFileOrUrl: generated, name, category, traits: { description } });
    onSaved();
  }

  function pickCanon(nav: { key: string; name: string; category: string; image: string }) {
    createNavatar({
      method: 'canon',
      imageFileOrUrl: nav.image,
      name: nav.name,
      category: nav.category,
      traits: { canon_key: nav.key },
    }).then(onSaved);
  }

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-2xl">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <button className={tab === 'upload' ? 'font-bold' : ''} onClick={() => setTab('upload')}>
              Upload
            </button>
            <button className={tab === 'ai' ? 'font-bold' : ''} onClick={() => setTab('ai')}>
              Describe & Generate
            </button>
            <button className={tab === 'canon' ? 'font-bold' : ''} onClick={() => setTab('canon')}>
              Pick Canon
            </button>
          </div>
          <button onClick={onClose}>✕</button>
        </div>
        {tab === 'upload' && (
          <div className="space-y-2">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <input
              className="border p-2 w-full"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <button onClick={saveUpload} className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>
        )}
        {tab === 'ai' && (
          <div className="space-y-2">
            <input
              className="border p-2 w-full"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="border p-2 w-full"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <textarea
              className="border p-2 w-full"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {generated && <img src={generated} alt="preview" className="w-48 h-48 object-cover" />}
            <div className="flex gap-2">
              <button onClick={generate} className="px-4 py-2 bg-gray-200 rounded">
                Generate
              </button>
              {generated && (
                <button onClick={saveAi} className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
                </button>
              )}
            </div>
          </div>
        )}
        {tab === 'canon' && <CanonPicker onPick={pickCanon} />}
      </div>
    </div>
  );
}
