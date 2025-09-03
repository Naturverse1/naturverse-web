import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useSession } from '../../lib/session';
import { getSupabase } from '../../lib/supabase';
import './Navatar.css';

export default function Generate() {
  const navigate = useNavigate();
  const user = useSession();
  const supabase = getSupabase();
  const [form, setForm] = useState<{ prompt: string; name: string; source?: File | null; mask?: File | null }>({
    prompt: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const upload = async (file?: File | null) => {
        if (!file) return undefined;
        const path = `${user?.id || 'anon'}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('avatars').upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/png',
        });
        if (error) throw error;
        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(data.path);
        return pub.publicUrl;
      };

      const [sourceUrl, maskUrl] = await Promise.all([
        upload(form.source),
        upload(form.mask),
      ]);

      const res = await fetch('/.netlify/functions/generate-navatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: form.prompt,
          name: form.name,
          userId: user?.id,
          sourceImageUrl: sourceUrl,
          maskImageUrl: maskUrl,
          size: '1024x1536',
        }),
      });
      const { error: err } = await res.json();
      if (!res.ok) throw new Error(err || 'Generation failed');
      navigate('/navatar?refresh=1');
    } catch (err: any) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nv-Page">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }, { label: 'Describe & Generate' }]} />
      <h1>Describe &amp; Generate</h1>
      <form onSubmit={onSubmit} className="nv-Card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <textarea
          placeholder="Describe your Navatar"
          value={form.prompt}
          onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
          rows={4}
        />
        <label>
          Source image (optional)
          <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, source: e.target.files?.[0] || null }))} />
        </label>
        <label>
          Mask image (optional)
          <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, mask: e.target.files?.[0] || null }))} />
        </label>
        <input
          type="text"
          placeholder="Name (optional)"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button className="nv-PrimaryBtn" type="submit" disabled={loading}>
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </form>
    </div>
  );
}
