import { supabase } from "./supabaseClient";

export async function signIn(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.origin }
  });
}
export async function signOut() { return supabase.auth.signOut(); }
export async function getSession() { return supabase.auth.getSession(); }
