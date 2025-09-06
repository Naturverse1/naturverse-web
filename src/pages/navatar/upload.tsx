import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import { Pills } from '../../components/navatar/Pills';
import { CardFrame } from '../../components/navatar/CardFrame';
import { saveUserNavatar } from '@/lib/supabase/navatar';
import { useAuth } from '@/lib/auth-context';
import '../../styles/navatar.css';

export default function UploadNavatarPage() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const nav = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!file) {
      setPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !user) return;
    await saveUserNavatar(user.id, file, name);
    nav('/navatar');
  }

  return (
    <main className="container">
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/navatar', label: 'Navatar' }, { label: 'Upload' }]} />
      <h1 className="nv-heading">Upload a Navatar</h1>
      <Pills hub="navatar" active="upload" hideOnMobileSubpages />
      <form
        onSubmit={onSave}
        style={{ display: 'grid', justifyItems: 'center', gap: 12, maxWidth: 480, margin: '16px auto' }}
      >
        <CardFrame title={name || 'My Navatar'}>
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <div className="nav-card__placeholder">No photo</div>
          )}
        </CardFrame>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input
          style={{ display: 'block', width: '100%' }}
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="pill pill--active" type="submit">
          Save
        </button>
      </form>
    </main>
  );
}

