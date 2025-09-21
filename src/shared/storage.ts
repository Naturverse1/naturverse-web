import { supabase } from '../lib/supabaseClient';
import { NAVATAR_BUCKET } from '../lib/storage';

const IMAGE_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'];

export async function listNavatarImages() {
  const path = 'navatars';
  const { data, error } = await supabase
    .storage
    .from(NAVATAR_BUCKET)
    .list(path, { limit: 200, sortBy: { column: 'name', order: 'asc' } });

  if (error) throw error;

  return (data ?? [])
    .filter(item => item.id) // keep files only
    .filter(item => {
      const n = item.name.toLowerCase();
      return IMAGE_EXT.some(ext => n.endsWith(ext));
    })
    .map(item => {
      const fullPath = `${path}/${item.name}`;
      const { data: pub } = supabase.storage.from(NAVATAR_BUCKET).getPublicUrl(fullPath);
      return { name: item.name, url: pub.publicUrl, path: fullPath };
    });
}
