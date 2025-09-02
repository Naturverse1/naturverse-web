import { createClient } from '@supabase/supabase-js';
import { NAVATARS, Navatar } from '../data/navatars';

export const supabase = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? import.meta.env.VITE_SUPABASE_URL)!,
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY)!
);

const LS_OWNED = 'nv_owned_navatars';
const LS_ACTIVE = 'nv_active_navatar';

function readOwnedLocal(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_OWNED) || '[]');
  } catch {
    return [];
  }
}

function writeOwnedLocal(ids: string[]) {
  localStorage.setItem(LS_OWNED, JSON.stringify([...new Set(ids)]));
}

export function getActiveLocal(): string | null {
  return localStorage.getItem(LS_ACTIVE);
}

export function setActiveLocal(id: string) {
  localStorage.setItem(LS_ACTIVE, id);
}

export async function listAll(): Promise<Navatar[]> {
  return NAVATARS;
}

export async function getOwned(): Promise<string[]> {
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    const { data, error } = await supabase
      .from('owned_navatars')
      .select('navatar_id')
      .eq('user_id', user.user.id);
    if (!error && data) return data.map((r) => r.navatar_id as string);
  }
  return readOwnedLocal();
}

export async function own(id: string): Promise<void> {
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    await supabase
      .from('owned_navatars')
      .insert({ user_id: user.user.id, navatar_id: id, source: 'claim' })
      .select()
      .single();
    return;
  }
  const current = readOwnedLocal();
  current.push(id);
  writeOwnedLocal(current);
}

export async function getActive(): Promise<string | null> {
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('navatar_id')
      .eq('id', user.user.id)
      .single();
    return (data?.navatar_id as string) || null;
  }
  return getActiveLocal();
}

export async function setActive(id: string) {
  const { data: user } = await supabase.auth.getUser();
  if (user?.user) {
    await supabase.from('profiles').update({ navatar_id: id }).eq('id', user.user.id);
    return;
  }
  setActiveLocal(id);
}

export async function listAvatars(userId: string) {
  return supabase.from('avatars').select('*').eq('user_id', userId).order('created_at', { ascending: false });
}

export async function uploadAvatarImage(userId: string, file: File) {
  const ext = file.name.split('.').pop() || 'png';
  const path = `avatars/${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}

export async function createAvatar(row: {
  user_id: string;
  name: string;
  category: string;
  method: 'upload' | 'ai' | 'canon';
  image_url: string;
  traits?: any;
}) {
  return supabase.from('avatars').insert(row).select().single();
}

export async function setPrimaryAvatar(userId: string, avatarId: string, imageUrl: string) {
  const [r1, r2, r3] = await Promise.all([
    supabase.from('avatars').update({ is_primary: false }).eq('user_id', userId),
    supabase.from('avatars').update({ is_primary: true }).eq('id', avatarId),
    supabase.from('users').update({ primary_avatar_id: avatarId, avatar_url: imageUrl }).eq('id', userId),
  ]);
  return r1.error || r2.error || r3.error ? { error: r1.error || r2.error || r3.error } : { data: true };
}

export async function deleteAvatar(userId: string, avatarId: string) {
  return supabase.from('avatars').delete().eq('id', avatarId).eq('user_id', userId);
}

export async function generateImageFromPrompt(prompt: string) {
  const res = await fetch('/.netlify/functions/generate_navatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j?.error || `generate_failed_${res.status}`);
  if (!j?.b64) throw new Error('no_image_returned');
  return `data:image/png;base64,${j.b64}`;
}
