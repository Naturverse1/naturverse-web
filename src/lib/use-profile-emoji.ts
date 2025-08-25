'use client';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useProfileEmoji() {
  const [emoji, setEmoji] = useState('🙂');
  useEffect(() => {
    const fetchEmoji = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('navatar_emoji, avatar')
        .single();
      if (data?.navatar_emoji) setEmoji(data.navatar_emoji);
      else if (data?.avatar) setEmoji('🧑‍🎨');
    };
    fetchEmoji();
  }, []);
  return emoji;
}
