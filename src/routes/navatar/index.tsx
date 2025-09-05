import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { saveNavatar } from '@/lib/navatar';

const types = ['Animal', 'Fruit', 'Insect', 'Spirit'] as const;

export default function Navatar() {
  const [baseType, setBaseType] = useState<(typeof types)[number]>('Animal');
  const [name, setName] = useState('');
  const [backstory, setBackstory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      alert('Please sign in to save your Navatar');
      setSaving(false);
      return;
    }
    try {
      await saveNavatar({
        supabase,
        userId: user.id,
        name: name.trim() || null,
        baseType,
        backstory: backstory.trim() || null,
        file,
      });
      navigate('/navatar');
    } catch (err) {
      console.error(err);
      alert('Could not save Navatar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4 navatar-page">
      <h2 className="text-2xl font-bold">Navatar Creator</h2>
      <form onSubmit={onSave} className="space-y-4 navatar-form navatar-layout">
        <div className="navatar-card">
          <div className="navatar-preview">
            {preview ? (
              <img src={preview} alt="Navatar preview" />
            ) : (
              <div className="empty-preview">No photo</div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium">Name</span>
            <input
              className="w-full rounded border p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <div>
            <div className="mb-2 text-sm font-medium">Base type</div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {types.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setBaseType(t)}
                  className={
                    'rounded border p-2 text-left ' +
                    (baseType === t ? 'ring-2 ring-green-500' : '')
                  }
                >
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-gray-600">Select</div>
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="block text-sm font-medium">Backstory</span>
            <textarea
              className="w-full rounded border p-2"
              rows={3}
              value={backstory}
              onChange={(e) => setBackstory(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium">Photo</span>
            <input type="file" accept="image/*" onChange={onFile} />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded border px-3 py-1 bg-green-600 text-white disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Navatar'}
          </button>
        </div>
      </form>
    </section>
  );
}
