import { supabase } from "./supabase-client";

export type NavatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  base_type: string;          // 'Animal' | 'Fruit' | 'Insect' | 'Spirit'
  backstory: string | null;
  image_path: string | null;  // storage key inside the 'avatars' bucket
  created_at: string;
  updated_at: string;
};

export function navatarImageUrl(image_path: string | null) {
  if (!image_path) return null;
  // bucket is 'avatars'
  const { data } = supabase.storage.from("avatars").getPublicUrl(image_path);
  return data?.publicUrl ?? null;
}

export async function listMyNavatars() {
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr || !user) throw new Error("Not signed in");
  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as NavatarRow[];
}

export async function saveNavatar(opts: {
  name?: string;
  base_type: "Animal" | "Fruit" | "Insect" | "Spirit";
  backstory?: string;
  file?: File | null;
}) {
  const { data: { user }, error: uErr } = await supabase.auth.getUser();
  if (uErr || !user) throw new Error("Not signed in");

  let image_path: string | null = null;

  if (opts.file) {
    // create a deterministic file path
    const ext = opts.file.name.split(".").pop() || "png";
    const fileName = `${crypto.randomUUID()}.${ext}`;
    image_path = `navatars/${user.id}/${fileName}`;
    const { error: upErr } = await supabase
      .storage.from("avatars")
      .upload(image_path, opts.file, { upsert: false });
    if (upErr) throw upErr;
  }

  const { data, error } = await supabase
    .from("avatars")
    .insert([{ 
      name: opts.name ?? null,
      base_type: opts.base_type,
      backstory: opts.backstory ?? null,
      image_path,
    }])
    .select()
    .single();

  if (error) throw error;
  return data as NavatarRow;
}

export { getCharacterCard as getCardForAvatar } from "./avatars";

