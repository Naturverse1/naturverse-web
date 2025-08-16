import { supabase } from "@/supabaseClient";

const BUCKET = "avatars";

export type ProfileRow = {
  id: string;
  email: string | null;
  avatar_path: string | null;
};

export async function getMyProfile(): Promise<ProfileRow | null> {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id,email,avatar_path")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}

export function getPublicAvatarUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // cache-bust so the newly uploaded image shows right away
  return data?.publicUrl ? `${data.publicUrl}?v=${Date.now()}` : null;
}

export async function uploadNavatar(file: File): Promise<string> {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw userErr;

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    contentType: file.type,
    upsert: true,
  });
  if (upErr) throw upErr;

  // Store the path on the user row
  const { error: updErr } = await supabase
    .from("users")
    .update({ avatar_path: fileName })
    .eq("id", user.id);
  if (updErr) throw updErr;

  return fileName;
}
