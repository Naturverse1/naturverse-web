import { supabase } from '../../lib/supabase-client';
import type { CatalogManifest, NavatarRow } from './types';

export async function listMyNavatars(): Promise<NavatarRow[]> {
  const { data, error } = await supabase
    .from('avatars')
    .select('id,user_id,name,category,image_url,backstory,created_at')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('listMyNavatars error', error);
    return [];
  }
  return (data ?? []) as NavatarRow[];
}

export async function loadCatalog(): Promise<CatalogManifest> {
  const res = await fetch('/navatars/manifest.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load Navatar catalog');
  return (await res.json()) as CatalogManifest;
}
