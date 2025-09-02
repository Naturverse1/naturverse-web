import { supabase } from './supabase';

export async function saveNavatarSelection(label: string, src: string) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error('Please sign in');

  const payload = {
    user_id: user.id,     // trigger will set it too, but we provide it
    label,
    src,
    method: 'pick',       // NOTE: relies on your existing "method" column
    is_primary: true,
    public: true
  };

  // User has exactly one primary avatar; upsert by user_id
  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) throw error;
}
