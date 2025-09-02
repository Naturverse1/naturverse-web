import { createClient } from "@supabase/supabase-js";

export const supa = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function uploadToNavatars(file: File, userId: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const path = `uploads/${userId}/${Date.now()}.${ext}`;
  const { error } = await supa.storage.from("navatars").upload(path, file, {
    cacheControl: "3600",
    upsert: true
  });
  if (error) throw error;
  const { data } = supa.storage.from("navatars").getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}
