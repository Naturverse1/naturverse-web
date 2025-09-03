import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabase } from '../../lib/supabase';
import { useSession } from '../../lib/session';
import '../../styles/navatar.css';

export default function NavatarGenerate() {
  const navigate = useNavigate();
  const user = useSession();
  const supabase = getSupabase();
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleGenerateDone() {
    if (!user?.id) return alert('Please sign in');
    if (!imageUrl) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('avatars')
        .upsert(
          {
            user_id: user.id,
            name: title || 'Navatar',
            category: 'ai',
            method: 'generate',
            image_url: imageUrl,
          },
          { onConflict: 'user_id', ignoreDuplicates: false }
        );
      if (error) throw error;
      navigate('/navatar?refresh=1');
    } catch (e: any) {
      alert(e.message || String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container">
      <nav className="nv-breadcrumbs brand-blue">
        <Link to="/">Home</Link>
        <span className="sep">/</span>
        <Link to="/navatar">Navatar</Link>
        <span className="sep">/</span>
        <span>Describe &amp; Generate</span>
      </nav>
      <h1>Describe &amp; Generate</h1>
      <p>Enter an image URL and name to save your generated Navatar.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
        <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        <input type="text" placeholder="Name (optional)" value={title} onChange={e => setTitle(e.target.value)} />
        <button className="primary" onClick={handleGenerateDone} disabled={!imageUrl || saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
