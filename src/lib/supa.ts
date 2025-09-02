import { createClient } from "@supabase/supabase-js";

export const supa = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: true, detectSessionInUrl: true }
  }
);

export const publicUrl = (path: string) =>
  supa.storage.from("avatars").getPublicUrl(path).data.publicUrl;
