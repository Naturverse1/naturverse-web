'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

export function useProfileEmoji() {
  const [emoji, setEmoji] = useState('🙂');
  useEffect(() => {
    const fetchEmoji = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('navatar_emoji, avatar')
        .single();
      const profile = data as { navatar_emoji?: string | null; avatar?: string | null } | null;
      if (profile?.navatar_emoji) setEmoji(profile.navatar_emoji);
      else if (profile?.avatar) setEmoji('🧑‍🎨');
    };
    fetchEmoji();
  }, []);
  return emoji;
}
