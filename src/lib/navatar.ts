import { supabase } from "./supabase-client";

export type NavatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  image_path: string; // "public/navatars/<uid>/<uuid>.png"
  is_primary: boolean;
  created_at: string;
  url?: string; // signed
};

const BUCKET = "avatars";
const SIGNED_URL_SECS = 3600;

// helper: signed URL from storage path
async function signedUrlFromPath(image_path: string) {
  // strip "public/" because the bucket is avatars
  const key = image_path.replace(/^public\//, "");
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(key, SIGNED_URL_SECS);
  if (error) throw error;
  return data?.signedUrl ?? "";
}

// legacy helper: return a public URL for a stored path
export function navatarImageUrl(image_path: string | null) {
  if (!image_path) return null;
  const key = image_path.replace(/^public\//, "");
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
  return data?.publicUrl ?? null;
}

/** Return the user's primary navatar (or null). */
export async function getMyNavatar(): Promise<NavatarRow | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("navatars")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_primary", true)
    .maybeSingle();

  if (error && error.code !== "PGRST116") throw error; // no rows
  if (!data) return null;

  return { ...data, url: await signedUrlFromPath(data.image_path) };
}

/** List all of the current user's navatars (with signed URLs). */
export async function listMyNavatars(): Promise<NavatarRow[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("navatars")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => ({
      ...row,
      url: await signedUrlFromPath(row.image_path),
    }))
  );
}

/** Upload a new navatar image and create the DB row. */
export async function uploadNavatar(file: File, name?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const id = crypto.randomUUID();
  const key = `public/navatars/${user.id}/${id}.png`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(key.replace(/^public\//, ""), file, {
      upsert: false,
      contentType: file.type || "image/png",
    });
  if (upErr) throw upErr;

  const { data, error } = await supabase
    .from("navatars")
    .insert({
      id,
      user_id: user.id,
      name: name ?? null,
      image_path: key,
      is_primary: true,
    })
    .select("*")
    .single();

  if (error) throw error;

  return { ...data, url: await signedUrlFromPath(key) } as NavatarRow;
}

export async function setPrimaryNavatar(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("navatars")
    .update({ is_primary: true })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error) throw error;
  return {
    ...(data as NavatarRow),
    url: await signedUrlFromPath((data as NavatarRow).image_path),
  };
}

export async function deleteNavatar(id: string) {
  const { data: row, error: getErr } = await supabase
    .from("navatars")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (getErr) throw getErr;
  if (!row) return;

  await supabase.storage
    .from(BUCKET)
    .remove([row.image_path.replace(/^public\//, "")]);
  await supabase.from("navatars").delete().eq("id", id);
}

/** Card I/O (alignment -> kingdom) */
export type NavatarCard = {
  navatar_id: string;
  name?: string | null;
  species?: string | null;
  kingdom?: string | null; // renamed
  backstory?: string | null;
  powers?: string[] | null;
  traits?: string[] | null;
};

export async function saveCard(card: NavatarCard) {
  const { data, error } = await supabase
    .from("navatar_cards")
    .upsert(card, { onConflict: "navatar_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as NavatarCard;
}

export async function loadCard(navatar_id: string) {
  const { data, error } = await supabase
    .from("navatar_cards")
    .select("*")
    .eq("navatar_id", navatar_id)
    .maybeSingle();
  if (error) throw error;
  return data as NavatarCard | null;
}

/** @deprecated Use uploadNavatar instead */
export async function saveNavatar(opts: {
  name?: string;
  base_type: string;
  backstory?: string;
  file?: File | null;
}) {
  if (!opts.file) throw new Error("File required");
  return uploadNavatar(opts.file, opts.name);
}

