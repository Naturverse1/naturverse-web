export type Navatar = { id: string; image: string };

export function getNavatar(): Navatar | null {
  try {
    const raw = localStorage.getItem('natur_navatar');
    if (raw) return JSON.parse(raw) as Navatar;
  } catch {
    // ignore parse errors
  }
  return null;
}

export const getNavatarUrl = async (): Promise<string | null> => {
  const nav = getNavatar();
  if (nav?.image) return nav.image;

  const local = localStorage.getItem('navatar_preview');
  if (local) return local;

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const sb = createClient(
      import.meta.env.VITE_SUPABASE_URL!,
      import.meta.env.VITE_SUPABASE_ANON_KEY!,
    );
    const { data, error } = await sb
      .from('users')
      .select('avatar_url, avatar_path')
      .limit(1)
      .single();
    if (!error && data?.avatar_url) return data.avatar_url as string;
  } catch {
    /* ignore if not configured */
  }

  return null;
};
