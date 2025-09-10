import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';

export type CardData = {
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];   // comma-joined in UI
  traits?: string[];   // comma-joined in UI
};

export type Navatar = {
  id: string;            // uuid in DB
  user_id: string;       // auth user
  title: string;         // display name under the image
  image_url: string;     // public URL (storage or /navatars/…)
};

type Ctx = {
  userId: string | null;
  active?: Navatar | null;
  card?: CardData | null;
  loading: boolean;
  setActiveFromPick: (title: string, imageUrl: string) => Promise<void>;
  setActiveFromUpload: (publicUrl: string, title?: string) => Promise<void>;
  saveCard: (data: CardData) => Promise<void>;
  refresh: () => Promise<void>;
};

const NavatarContext = createContext<Ctx | null>(null);
export const useNavatar = () => {
  const ctx = useContext(NavatarContext);
  if (!ctx) throw new Error('useNavatar must be used within NavatarProvider');
  return ctx;
};

const LS_KEY = 'active_avatar_id';

export const NavatarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [active, setActive] = useState<Navatar | null>(null);
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  // auth
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUserId(data.user?.id ?? null);
      setLoading(false);
    })();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setUserId(sess?.user?.id ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const fetchActive = async (uid: string) => {
    const fromLS = localStorage.getItem(LS_KEY) || null;

    // If LS has an id, try it first
    if (fromLS) {
      const { data, error } = await supabase
        .from('avatars')
        .select('id,user_id,title,image_url')
        .eq('user_id', uid)
        .eq('id', fromLS)
        .maybeSingle();
      if (!error && data) {
        setActive(data as Navatar);
        return data.id;
      }
    }

    // Otherwise take the most recent for this user
    const { data: rows } = await supabase
      .from('avatars')
      .select('id,user_id,title,image_url')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(1);

    if (rows && rows.length) {
      localStorage.setItem(LS_KEY, rows[0].id);
      setActive(rows[0] as Navatar);
      return rows[0].id as string;
    }

    setActive(null);
    localStorage.removeItem(LS_KEY);
    return null;
  };

  const fetchCard = async (uid: string, avatarId: string) => {
    const { data } = await supabase
      .from('character_cards')
      .select('name,species,kingdom,backstory,powers,traits')
      .eq('user_id', uid)
      .eq('avatar_id', avatarId)
      .maybeSingle();
    if (data) {
      setCard({
        name: data.name ?? '',
        species: data.species ?? '',
        kingdom: data.kingdom ?? '',
        backstory: data.backstory ?? '',
        powers: Array.isArray(data.powers) ? data.powers : (data.powers ? String(data.powers).split(',').map(s => s.trim()).filter(Boolean) : []),
        traits: Array.isArray(data.traits) ? data.traits : (data.traits ? String(data.traits).split(',').map(s => s.trim()).filter(Boolean) : []),
      });
    } else {
      setCard(null);
    }
  };

  const refresh = async () => {
    if (!userId) return;
    const id = await fetchActive(userId);
    if (id) await fetchCard(userId, id);
  };

  useEffect(() => { if (userId) refresh(); }, [userId]);

  const setActiveFromPick = async (title: string, imageUrl: string) => {
    if (!userId) throw new Error('Please sign in');
    const { data, error } = await supabase
      .from('avatars')
      .insert({ user_id: userId, title, image_url: imageUrl })
      .select('id,user_id,title,image_url')
      .single();
    if (error) throw error;
    localStorage.setItem(LS_KEY, data.id);
    setActive(data as Navatar);
    await fetchCard(userId, data.id);
  };

  const setActiveFromUpload = async (publicUrl: string, title?: string) => {
    return setActiveFromPick(title ?? 'Uploaded', publicUrl);
  };

  const saveCard = async (data: CardData) => {
    if (!userId || !active?.id) throw new Error('Please pick or upload a Navatar first.');
    const payload = {
      user_id: userId,
      avatar_id: active.id,
      name: data.name ?? '',
      species: data.species ?? '',
      kingdom: data.kingdom ?? '',
      backstory: data.backstory ?? '',
      powers: (data.powers ?? []).filter(Boolean),
      traits: (data.traits ?? []).filter(Boolean),
    };

    // Upsert by composite key (user_id, avatar_id)
    const { error } = await supabase
      .from('character_cards')
      .upsert(payload, { onConflict: 'user_id,avatar_id' });

    if (error) throw error;
    setCard(payload);
  };

  const value = useMemo<Ctx>(() => ({
    userId, active, card, loading,
    setActiveFromPick, setActiveFromUpload, saveCard, refresh,
  }), [userId, active, card, loading]);

  return <NavatarContext.Provider value={value}>{children}</NavatarContext.Provider>;
};

