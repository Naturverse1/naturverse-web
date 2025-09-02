import { NAVATARS, Navatar } from '../data/navatars';
import { supabase } from './supabase';

const LS_OWNED = 'nv_owned_navatars';
const LS_ACTIVE = 'nv_active_navatar';

function readOwnedLocal(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_OWNED) || '[]');
  } catch {
    return [];
  }
}

function writeOwnedLocal(ids: string[]) {
  localStorage.setItem(LS_OWNED, JSON.stringify([...new Set(ids)]));
}

export function getActiveLocal(): string | null {
  return localStorage.getItem(LS_ACTIVE);
}

export function setActiveLocal(id: string) {
  localStorage.setItem(LS_ACTIVE, id);
}

export async function listAll(): Promise<Navatar[]> {
  return NAVATARS;
}

export async function getOwned(): Promise<string[]> {
  if (supabase) {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      const { data, error } = await supabase
        .from('owned_navatars')
        .select('navatar_id')
        .eq('user_id', user.user.id);
      if (!error && data) return data.map((r) => r.navatar_id as string);
    }
  }
  return readOwnedLocal();
}

export async function own(id: string): Promise<void> {
  if (supabase) {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      await supabase
        .from('owned_navatars')
        .insert({ user_id: user.user.id, navatar_id: id, source: 'claim' })
        .select()
        .single();
      return;
    }
  }
  const current = readOwnedLocal();
  current.push(id);
  writeOwnedLocal(current);
}

export async function getActive(): Promise<string | null> {
  if (supabase) {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      const { data } = await supabase
        .from('profiles')
        .select('navatar_id')
        .eq('id', user.user.id)
        .single();
      return (data?.navatar_id as string) || null;
    }
  }
  return getActiveLocal();
}

export async function setActive(id: string) {
  if (supabase) {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      await supabase.from('profiles').update({ navatar_id: id }).eq('id', user.user.id);
      return;
    }
  }
  setActiveLocal(id);
}

export type NavatarItem = {
  name: string;
  url: string;
};

export async function listNavatars(limit = 1000): Promise<NavatarItem[]> {
  const { data, error } = await supabase.storage
    .from('navatars')
    .list('', { limit, sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    console.error('listNavatars error:', error);
    return [];
  }

  return (data ?? [])
    .filter((f) => !f.name.startsWith('.') && !f.name.endsWith('/'))
    .map((f) => {
      const { data: pub } = supabase.storage.from('navatars').getPublicUrl(f.name);
      return { name: f.name, url: pub.publicUrl };
    });
}

export async function saveNavatarSelection(imageUrl: string) {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user;
  if (!user) throw new Error('Not signed in');

  const payload = {
    user_id: user.id,
    name: 'Navatar',
    method: 'pick',
    image_url: imageUrl,
    is_primary: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('avatars')
    .upsert(payload, { onConflict: 'user_id' });

  if (error) {
    console.error('saveNavatarSelection error:', error);
    throw error;
  }
}
