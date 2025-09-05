import { supabase } from './supabase';

export type NavatarType = 'Animal' | 'Fruit' | 'Insect' | 'Spirit';

export type Navatar = {
  id: string;
  user_id: string;
  name: string | null;
  type: NavatarType;
  backstory: string;
  photo_url: string | null;
  created_at: string;
};

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function listNavatars(): Promise<Navatar[]> {
  const session = await getSession();
  if (!session) return [];
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function uploadPhoto(file: File, userId: string) {
  const ext = file.name.split('.').pop() || 'png';
  const path = `navatars/${userId}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('avatars')
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path);
  return { path, publicUrl: pub.publicUrl };
}

export async function createNavatar(input: {
  name?: string;
  type: NavatarType;
  backstory: string;
  file?: File | null;
}) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  let photo_url: string | null = null;
  if (input.file) {
    const uploaded = await uploadPhoto(input.file, session.user.id);
    photo_url = uploaded.publicUrl;
  }

  const { data, error } = await supabase
    .from('avatars')
    .insert({
      user_id: session.user.id,
      name: input.name || null,
      type: input.type,
      backstory: input.backstory,
      photo_url,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Navatar;
}

