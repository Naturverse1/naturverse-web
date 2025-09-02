import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export type Navatar = {
  id: string;
  user_id: string | null;
  name: string | null;
  category: string | null;
  image_url: string | null;
  image_path: string | null;
  thumbnail_url: string | null;
  method: 'upload' | 'ai' | 'canon';
  is_primary: boolean | null;
  is_public: boolean | null;
  status: string | null;
  status_message: string | null;
  created_at: string | null;
};

const BUCKET = 'avatars';

export async function listNavatars() {
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Navatar[];
}

export async function uploadToStorage(file: File, userId: string) {
  const ext = file.name.split('.').pop() || 'png';
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'image/png',
    upsert: false,
  });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, publicUrl: pub?.publicUrl || null };
}

export async function createAvatarRow(partial: Partial<Navatar>) {
  const payload = {
    method: 'upload',
    status: 'ready',
    is_primary: false,
    is_public: false,
    ...partial,
  };
  const { data, error } = await supabase.from('avatars').insert(payload).select('*').single();
  if (error) throw error;
  return data as Navatar;
}

export async function deleteAvatar(id: string) {
  const { error } = await supabase.from('avatars').delete().eq('id', id);
  if (error) throw error;
}

export async function setPrimaryAvatar(id: string) {
  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in');

  // set all false, then one true (within RLS)
  const { error: e1 } = await supabase.from('avatars').update({ is_primary: false }).eq('user_id', user.id);
  if (e1) throw e1;

  const { error: e2 } = await supabase.from('avatars').update({ is_primary: true }).eq('id', id);
  if (e2) throw e2;
}

export function publicCanonOptions() {
  // Keep in sync with /public/navatars
  return [
    { key: 'bamboo', label: 'Bamboo', url: '/navatars/bamboo.svg' },
    { key: 'firefox', label: 'Firefox', url: '/navatars/firefox.svg' },
    { key: 'oceanorb', label: 'Ocean Orb', url: '/navatars/oceanorb.svg' },
    { key: 'seedling', label: 'Seedling', url: '/navatars/seedling.svg' },
    { key: 'splash', label: 'Splash', url: '/navatars/splash.svg' },
    { key: 'zenpanda', label: 'Zen Panda', url: '/navatars/zenpanda.svg' },
  ];
}

