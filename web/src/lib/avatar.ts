import supabase from "@/lib/supabaseClient";

if (!supabase) throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Netlify.');

export async function uploadAvatar(file: File, userId: string) {
  const ext = file.name.split(".").pop() ?? "png";
  const path = `avatars/${userId}/${Date.now()}.${ext}`;

  // Upload (upsert to overwrite old file path if same name)
  const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (upErr) throw upErr;

  // Get a public URL for display
  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const publicUrl = pub?.publicUrl ?? null;

  // Persist on the user row
  const { error: dbErr } = await supabase
    .from("users")
    .update({ avatar_path: path, avatar_url: publicUrl })
    .eq("id", userId);
  if (dbErr) throw dbErr;

  return { path, url: publicUrl };
}

export async function fetchAvatar(userId: string) {
  // Prefer avatar_url (stable across policy/CDN), fallback to signed URL if needed
  const { data, error } = await supabase
    .from("users")
    .select("avatar_url, avatar_path")
    .eq("id", userId)
    .single();
  if (error) throw error;

  if (data?.avatar_url) return data.avatar_url;

  if (data?.avatar_path) {
    // If bucket is not public, sign a URL:
    const { data: signed } = await supabase
      .storage
      .from("avatars")
      .createSignedUrl(data.avatar_path, 60 * 60); // 1 hour
    return signed?.signedUrl ?? null;
  }

  return null;
}

