import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) console.warn("⚠️ Missing Supabase env vars");

export const supabase = createClient(url ?? "", key ?? "", {
  auth: { persistSession: true },
});

export function publicAvatarUrl(path: string) {
  if (!path) return "";
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
