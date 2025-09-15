import { supabase } from '../../lib/supabase-client';

export async function selectNavatar(objectPath: string, name?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  const payload = {
    user_id: user.id,
    name: name ?? objectPath.split('/').pop() ?? 'My Navatar',
    image_path: objectPath,
    image_url: null,
    is_primary: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' });
  if (error) throw error;
}
