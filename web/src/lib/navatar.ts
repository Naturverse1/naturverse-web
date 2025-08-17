export const getNavatarUrl = async (): Promise<string | null> => {
  // 1) localStorage preview (set by Profile page when choosing file)
  const local = localStorage.getItem('navatar_preview');
  if (local) return local;

  // 2) Supabase users table (optional—wrapped in try so no build issues)
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
