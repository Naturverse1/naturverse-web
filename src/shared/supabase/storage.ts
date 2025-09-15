import { supabase } from '../../lib/supabase-client';

export async function listPaged(prefix: string, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const { data, error } = await supabase
    .storage
    .from('avatars')
    .list(prefix, { limit: pageSize, offset, sortBy: { column: 'name', order: 'asc' } });
  if (error) throw error;
  return data ?? [];
}

export function publicUrl(path: string) {
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
}
