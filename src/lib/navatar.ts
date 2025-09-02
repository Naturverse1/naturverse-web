import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function listAvatars(userId: string) {
  return supabase.from('avatars').select('*').eq('user_id', userId).order('created_at', { ascending:false });
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
  user_id: string; name: string; category: string; method: 'upload'|'ai'|'canon'; image_url: string; traits?: any
}) {
  return supabase.from('avatars').insert(row).select().single();
}

export async function setPrimaryAvatar(userId: string, avatarId: string, imageUrl: string) {
  const reset = supabase.from('avatars').update({ is_primary:false }).eq('user_id', userId);
  const setOne = supabase.from('avatars').update({ is_primary:true }).eq('id', avatarId);
  const updUser = supabase.from('users').update({ primary_avatar_id: avatarId, avatar_url: imageUrl }).eq('id', userId);
  const [r1, r2, r3] = await Promise.all([reset, setOne, updUser]);
  return r1.error || r2.error || r3.error ? { error: r1.error || r2.error || r3.error } : { data: true };
}

export async function deleteAvatar(userId: string, avatarId: string) {
  return supabase.from('avatars').delete().eq('id', avatarId).eq('user_id', userId);
}

export async function generateImageFromPrompt(prompt: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) throw new Error('no_openai_key');
  // Use OpenAI Images API (1 image). You already have serverless runtime on Netlify.
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      n: 1,
      // white bg, centered, Naturverse style
      style: 'natural'
    })
  });
  if (!res.ok) throw new Error(await res.text());
  const j = await res.json();
  return j.data?.[0]?.b64_json ?? '';
}

export async function getActive(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('avatars').select('id').eq('user_id', user.id).eq('is_primary', true).single();
  return (data as any)?.id ?? null;
}
