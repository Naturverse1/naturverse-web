import { NAVATARS, Navatar } from '../data/navatars';
import { getSupabase } from './supabase-client';

const supabase = getSupabase();

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

export async function generateImageFromPrompt(prompt: string): Promise<string> {
  const res = await fetch('/.netlify/functions/generate_navatar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) {
    const j = await res.json().catch(() => ({}));
    throw new Error(j?.error || `generate_failed_${res.status}`);
  }
  const { b64 } = await res.json();
  if (!b64) throw new Error('no_image_returned');
  return `data:image/png;base64,${b64}`;
}
