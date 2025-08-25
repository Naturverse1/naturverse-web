// Thin wrappers around supabase-js so pages/components don't touch the client directly
import { supabase } from '@/lib/supabase-client';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

/**
 * Sign up a new user with email + password
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Sign in existing user
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
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

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get current user (session aware)
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// Legacy helper, keep for compatibility
export async function getUser() {
  return getCurrentUser();
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session ?? null;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: Function) {
  return supabase.auth.onAuthStateChange(
    (_event: AuthChangeEvent, session: Session | null) => {
      callback(session?.user ?? null);
    },
  );
}
