import { NAVATARS, Navatar } from '../data/navatars';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseAnon);

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

/** Upsert the user's chosen navatar into the avatars table. */
export async function saveNavatarSelection(label: string, src: string) {
  const { data: { user }, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  if (!user) throw new Error('Not signed in');

  // We assume table public.avatars has columns: user_id (uuid), label (text), src (text)
  // and a unique index/PK on user_id so we can upsert.
  const { error } = await supabase
    .from('avatars')
    .upsert(
      { user_id: user.id, label, src },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
}
