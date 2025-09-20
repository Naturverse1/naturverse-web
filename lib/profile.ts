import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });

export async function getNavatarUrl(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("navatar_url")
    .eq("id", userId)
    .single();
  if (error || !data?.navatar_url) return null;
  return data.navatar_url as string;
}
