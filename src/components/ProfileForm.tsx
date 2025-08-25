import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '../auth/AuthContext';
import { saveProfile } from '../lib/saveProfile';

export default function ProfileForm() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [file, setFile] = useState<File | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
      (async () => {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        if (data?.display_name) setDisplayName(data.display_name);
      })();
    }, [user]);

    async function save(e: React.FormEvent) {
      e.preventDefault();
      if (!user) return;
      try {
        setLoading(true);
        await saveProfile(supabase, user, displayName, file);
        alert('Profile saved!');
      } catch (e: any) {
        alert(`Save failed: ${e.message ?? 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }

  if (!user) return null;

    return (
      <form onSubmit={save} style={{ maxWidth: 400, margin: '1rem auto' }}>
        <h2>Profile</h2>
        <label style={{ display: 'block', margin: '8px 0 4px' }}>Display name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder='Your name'
          style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <label style={{ display: 'block', margin: '8px 0 4px' }}>Avatar</label>
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setFile(e.target.files?.[0])}
          style={{ display: 'block', marginBottom: 12 }}
        />
        <button
          type='submit'
          disabled={loading}
          style={{
            marginTop: 12,
            padding: '8px 14px',
            borderRadius: 8,
            border: 0,
            background: '#2f7ae5',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    );
}
