import { supabase } from '@/lib/supabaseClient';

type NavatarRow = {
  name: string | null;
  species: string | null;
  kingdom: string | null;
  backstory: string | null;
  image_url: string | null;
};

export type NavatarProfile = {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  imageUrl?: string;
};

export async function getActiveNavatarForUser(userId: string): Promise<NavatarProfile> {
  if (!userId) return {};

  const { data, error } = await supabase
    .from('navatars')
    .select('name,species,kingdom,backstory,image_url')
    .eq('owner_id', userId)
    .order('updated_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<NavatarRow>();

  if (error && (error as any).code !== 'PGRST116') {
    throw error;
  }

  if (!data) return {};

  return {
    name: data.name ?? undefined,
    species: data.species ?? undefined,
    kingdom: data.kingdom ?? undefined,
    backstory: data.backstory ?? undefined,
    imageUrl: data.image_url ?? undefined,
  };
}
