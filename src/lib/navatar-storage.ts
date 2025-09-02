import { supabase } from './supabase';

const BUCKET = 'navatars';          // bucket name
const FOLDER = 'navatars';          // folder inside bucket that holds images

const IMAGE_RE = /\.(png|jpe?g|webp|gif)$/i;

export type NavatarItem = {
  slug: string;
  label: string;
  src: string;
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function fetchNavatarCatalog(): Promise<NavatarItem[]> {
  // list files in the folder (this is the key fix)
  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .list(FOLDER, { limit: 500, sortBy: { column: 'name', order: 'asc' } });

  if (error) throw error;

  const files = (data ?? []).filter(entry => IMAGE_RE.test(entry.name));

  return files.map(f => {
    const filepath = `${FOLDER}/${f.name}`;
    const {
      data: { publicUrl }
    } = supabase.storage.from(BUCKET).getPublicUrl(filepath);

    const label = f.name.replace(IMAGE_RE, '');
    return { slug: slugify(label), label, src: publicUrl };
  });
}
