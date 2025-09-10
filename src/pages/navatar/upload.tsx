import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavatar } from '../../lib/navatar-context';
import NavTabs from '../../components/navatar/NavTabs';
import Breadcrumbs from '../../components/navatar/Breadcrumbs';

export default function Upload() {
  const { setActiveFromUpload, userId } = useNavatar();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');

  const onUpload = async () => {
    if (!userId) return alert('Please sign in');
    if (!file) return alert('Choose a file');
    const ext = file.name.split('.').pop();
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from('avatars').upload(path, file, {
      upsert: false,
      cacheControl: '3600',
    });
    if (error) return alert(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await setActiveFromUpload(data.publicUrl, name || file.name.replace(/\.[^.]+$/, ''));
    alert('Uploaded!');
  };

  return (
    <div className="max-w-screen-md mx-auto px-4">
      <Breadcrumbs trail={[{ to: '/navatar', label: 'Navatar' }, { label: 'Upload' }]} />
      <h1 className="text-4xl font-bold text-blue-700 mb-2">Upload</h1>
      <NavTabs />
      <div className="rounded-2xl border bg-white p-4 shadow">
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <input
          className="block mt-3 border rounded px-3 py-2 w-full"
          placeholder="Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button onClick={onUpload} className="mt-4 px-5 py-2 rounded-full bg-blue-600 text-white">
          Save
        </button>
      </div>
    </div>
  );
}

