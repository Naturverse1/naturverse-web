'use client';
import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/useSupabase';

export function useProfileEmoji() {
  const supabase = useSupabase();
  const [emoji, setEmoji] = useState('🙂');
  useEffect(() => {
    const fetchEmoji = async () => {
      if (!supabase) return;
      const { data } = await supabase
        .from('profiles')
        .select('navatar_emoji, avatar')
        .single();
      const profile = data as { navatar_emoji?: string | null; avatar?: string | null } | null;
      if (profile?.navatar_emoji) setEmoji(profile.navatar_emoji);
      else if (profile?.avatar) setEmoji('🧑‍🎨');
    };
    fetchEmoji();
  }, [supabase]);
  return emoji;
}
