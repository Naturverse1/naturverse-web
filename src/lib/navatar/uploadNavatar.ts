import supabase from "../supabaseClient";

export async function uploadNavatar(file: File, name?: string) {
  const sb = supabase();

  const { data: auth, error: authErr } = await sb.auth.getUser();
  if (authErr) throw authErr;
  const userId = auth.user?.id;
  if (!userId) throw new Error("Not signed in");

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const key = `navatars/${userId}/${crypto.randomUUID()}.${ext}`;

  const { error: upErr } = await sb.storage.from("public").upload(key, file, {
    upsert: false,
    cacheControl: "3600",
    contentType: file.type || undefined,
  });
  if (upErr?.message?.includes("already exists")) {
    // unlikely with UUID, but treat as success
  } else if (upErr) {
    throw upErr;
  }

  const { data: publicUrl } = sb.storage.from("public").getPublicUrl(key);

  const { data: row, error: insErr } = await sb
    .from("navatars")
    .insert({
      user_id: userId,
      name: name?.trim() || file.name,
      image_url: publicUrl.publicUrl,
      image_path: key,
    })
    .select()
    .single();

  if (insErr) throw insErr;
  return row;
}
