import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Table name is **navatars** (storage bucket remains **avatars**)
export async function saveNavatarRow(payload: any) {
  // e.g., { owner_id, name, image_url, meta }
  return await supabase.from("navatars").insert(payload).select().single();
}

export async function listNavatarsByUser(userId: string) {
  return await supabase
    .from("navatars")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });
}

// Storage bucket also **avatars**
export async function uploadNavatarImage(userId: string, file: File) {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase
    .storage
    .from("avatars")
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const { data: pub } = await supabase.storage
    .from("avatars")
    .getPublicUrl(path);
  return pub.publicUrl; // public URL for card
}
