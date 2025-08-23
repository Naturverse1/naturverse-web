// Thin wrappers around supabase-js so pages/components don't touch the client directly
import { supabase } from './db';

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session ?? null;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user ?? null;
}

export async function signInWithEmail(email: string, redirectTo?: string) {
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Please enter a valid email.');
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
  return true;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
