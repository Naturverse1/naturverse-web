import { getSupabase } from './supabase-client';
import { uploadAvatar, getPublicUrl } from './storage';

export type Navatar = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  image_url: string;
  traits: any;
  method: 'upload' | 'ai' | 'canon';
  is_primary: boolean;
};

export async function getNavatars(userId: string): Promise<Navatar[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('avatars')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');
  if (error) throw error;
  return (data as Navatar[]) || [];
}

export async function createNavatar({
  method,
  imageFileOrUrl,
  name,
  category,
  traits,
}: {
  method: 'upload' | 'ai' | 'canon';
  imageFileOrUrl: File | string;
  name: string;
  category: string;
  traits: any;
}): Promise<Navatar> {
  const supabase = getSupabase();
  const { data: u } = await supabase.auth.getUser();
  const user = u?.user;
  if (!user) throw new Error('Not authenticated');
  let imageUrl = '';
  if (typeof imageFileOrUrl === 'string') {
    if (imageFileOrUrl.startsWith('data:')) {
      const res = await fetch(imageFileOrUrl);
      const blob = await res.blob();
      const path = await uploadAvatar(user.id, new File([blob], 'navatar.png', { type: blob.type }));
      imageUrl = await getPublicUrl(path!);
    } else {
      imageUrl = imageFileOrUrl;
    }
  } else {
    const path = await uploadAvatar(user.id, imageFileOrUrl);
    imageUrl = await getPublicUrl(path!);
  }
  const { data, error } = await supabase
    .from('avatars')
    .insert({
      user_id: user.id,
      image_url: imageUrl,
      name,
      category,
      traits,
      method,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Navatar;
}

export async function updateNavatar(id: string, patch: Partial<Navatar>): Promise<Navatar> {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('avatars').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data as Navatar;
}

export async function deleteNavatar(id: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('avatars').delete().eq('id', id);
}

export async function setPrimaryAvatar(userId: string, avatarId: string, imageUrl: string): Promise<void> {
  const supabase = getSupabase();
  await supabase.from('avatars').update({ is_primary: false }).eq('user_id', userId);
  await supabase.from('avatars').update({ is_primary: true }).eq('id', avatarId);
  await supabase.from('users').update({ avatar_url: imageUrl, primary_avatar_id: avatarId }).eq('id', userId);
}

export async function generateImageFromPrompt(traits: any, description: string): Promise<string> {
  const promptParts = [
    traits?.name,
    traits?.category,
    description,
    'storybook, friendly, 2D, Naturverse style, clean white bg, centered',
  ];
  const prompt = promptParts.filter(Boolean).join(' ');
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({ prompt, n: 1, size: '512x512', response_format: 'b64_json' }),
  });
  const json = await res.json();
  return json.data?.[0]?.b64_json || '';
}

const LS_ACTIVE = 'nv_active_navatar';

export function getActiveLocal(): string | null {
  return localStorage.getItem(LS_ACTIVE);
}

export function setActiveLocal(id: string) {
  localStorage.setItem(LS_ACTIVE, id);
}

export async function getActive(): Promise<string | null> {
  const supabase = getSupabase();
  const { data: u } = await supabase.auth.getUser();
  const user = u?.user;
  if (!user) return getActiveLocal();
  const { data } = await supabase
    .from('users')
    .select('primary_avatar_id')
    .eq('id', user.id)
    .single();
  return (data?.primary_avatar_id as string) || getActiveLocal();
}

export async function setActive(id: string): Promise<void> {
  const supabase = getSupabase();
  const { data: u } = await supabase.auth.getUser();
  const user = u?.user;
  if (!user) return setActiveLocal(id);
  await supabase.from('users').update({ primary_avatar_id: id }).eq('id', user.id);
  setActiveLocal(id);
}
