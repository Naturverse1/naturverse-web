import { getBrowserClient } from "../supabaseClient";

const NAVATAR_BUCKET = "avatars";
const NAVATAR_PREFIX = "navatars";

export async function uploadNavatar(
  file: File,
  name?: string
): Promise<Record<string, any>> {
  const supabase = getBrowserClient();

  const {
    data: userData,
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData?.user;

  if (!user) {
    throw new Error("Not signed in");
  }

  const ext = (file.name.split(".").pop() || "png").toLowerCase();
  const objectName = `${NAVATAR_PREFIX}/${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(NAVATAR_BUCKET)
    .upload(objectName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: pub } = supabase.storage
    .from(NAVATAR_BUCKET)
    .getPublicUrl(objectName);

  const imageUrl = pub.publicUrl;

  const cleanedName = (name ?? file.name).trim();

  const {
    data: row,
    error: upsertError,
  } = await supabase
    .from("navatars")
    .upsert(
      {
        user_id: user.id,
        name: cleanedName || null,
        image_path: objectName,
        image_url: imageUrl,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (upsertError) throw upsertError;

  if (!row) {
    throw new Error("Upload failed");
  }

  const normalized = { ...row } as Record<string, any>;
  if (!("user_id" in normalized)) {
    normalized.user_id = user.id;
  }
  if (!("owner_id" in normalized)) {
    normalized.owner_id = normalized.user_id;
  }

  return normalized;
}
