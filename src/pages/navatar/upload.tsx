import { FormEvent, useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import NavatarBreadcrumbs from '../../components/NavatarBreadcrumbs';
import '../../styles/navatar.css';
import { uploadAndInsertAvatar } from '../../lib/navatar';

export default function UploadNavatar() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');

  if (!user) return <div className="navatar-shell"><p>Please sign in.</p></div>;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file) { alert('Choose an image first'); return; }
    await uploadAndInsertAvatar(user!.id, file, name);
    alert('Uploaded!');
  }

  return (
    <div className="navatar-shell">
      <NavatarBreadcrumbs />
      <h1>Upload Navatar</h1>

      <form className="center" onSubmit={onSubmit}>
        <input type="text" placeholder="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <br />
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <br />
        <button className="pill" type="submit">Save</button>
      </form>
      <p className="center">AI art & edit coming soon.</p>
    </div>
  );
}
