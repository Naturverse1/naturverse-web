import { useRef, useState } from 'react';
import { uploadAvatar } from '../../lib/supabaseAvatar';

export default function UploadNavatar() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const f = fileRef.current?.files?.[0];
    if (!f) return alert('Choose a file first');
    try {
      setBusy(true);
      await uploadAvatar(f, name || undefined);
      alert('Uploaded!');
      location.assign('/navatar');
    } catch (e: any) {
      alert(`Upload failed: ${e.message ?? e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="container">
      <h1 className="page">Upload</h1>
      <form onSubmit={onSave} className="form">
        <input type="text" placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} />
        <input ref={fileRef} type="file" accept="image/*" />
        <button className="btn" disabled={busy}>Save</button>
      </form>
    </main>
  );
}
