import { v4 as uuid } from "uuid";
import { supabaseBrowser } from "./supabaseClient";

const BUCKET = process.env.NEXT_PUBLIC_NAVATARS_BUCKET || "navatars";

export async function uploadNavatarImage(userId: string, file: File) {
  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const path = `users/${userId}/${uuid()}.${ext}`;

  const { error: upErr } = await supabaseBrowser
    .storage.from(BUCKET)
    .upload(path, file, { upsert: false });
  if (upErr) throw new Error(upErr.message);

  const { data } = supabaseBrowser.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createUploadRecord(userId: string, name: string | null, imageUrl: string) {
  const { data, error } = await supabaseBrowser
    .from("avatars")
    .insert({ user_id: userId, name, image_url: imageUrl, method: "upload" })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
