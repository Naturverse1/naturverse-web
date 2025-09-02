import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: { persistSession: true }
});

export type NavatarItem = { slug: string; label: string; src: string };

/** List public images in the `navatars` storage bucket. */
export async function listPublicNavatars(): Promise<NavatarItem[]> {
  const s = supabase.storage.from('navatars');

  // Root listing; set limit high enough for your gallery size
  const { data, error } = await s.list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
  if (error || !data) return [];

  return data
    .filter(obj => obj.id && obj.name && !obj.metadata?.isDirectory)
    .filter(obj => /(\.png|\.jpg|\.jpeg|\.webp)$/i.test(obj.name))
    .map(obj => {
      const label = obj.name.replace(/\.[^.]+$/, '');
      const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const { data: urlData } = s.getPublicUrl(obj.name);
      const src = urlData?.publicUrl ?? '';
      return { slug, label, src };
    })
    .filter(it => !!it.src);
}

/** Upsert the selected navatar for the current user. */
export async function saveNavatarSelection(label: string, src: string) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Not signed in.');

  const payload = { user_id: user.id, label, src };
  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' })
    .eq('user_id', user.id);

  if (error) throw error;
}
