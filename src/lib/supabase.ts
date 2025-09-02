import { supabase } from "./supabase-client";

export { supabase };

export async function saveCanonAvatar(userId: string, file: string) {
  const { data, error } = await supabase
    .from("avatars")
    .upsert(
      { user_id: userId, image_url: file, name: "canon" },
      { onConflict: "user_id" }
    );

  if (error) throw error;
  return data;
}
