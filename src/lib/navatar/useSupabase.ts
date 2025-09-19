import { supabase } from "@/lib/supabase-client";

// Table names & storage buckets are **avatars**
export async function saveAvatarRow(payload: any) {
  // e.g., { user_id, name, image_url, meta }
  return await supabase.from("avatars").insert(payload).select().single();
}

export async function listAvatarsByUser(userId: string) {
  return await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

// Storage bucket also **avatars**
export async function uploadAvatarImage(userId: string, file: File) {
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
