import { supabase } from "./supabase-client";

// Legacy Navatar row used by creator flows
export type NavatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  base_type: string; // 'Animal' | 'Fruit' | 'Insect' | 'Spirit'
  backstory: string | null;
  image_path: string | null; // storage key inside the 'avatars' bucket
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
};

export function navatarImageUrl(image_path: string | null) {
  if (!image_path) return null;
  // bucket is 'avatars'
  const { data } = supabase.storage.from("avatars").getPublicUrl(image_path);
  return data?.publicUrl ?? null;
}

export async function saveNavatar(opts: {
  name?: string;
  base_type: "Animal" | "Fruit" | "Insect" | "Spirit";
  backstory?: string;
  file?: File | null;
}) {
  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser();
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
    .from("navatars")
    .insert([
      {
        name: opts.name ?? null,
        base_type: opts.base_type,
        backstory: opts.backstory ?? null,
        image_path,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as NavatarRow;
}

/* ---------- Helpers for active Navatars ---------- */
export type Navatar = {
  id: string;
  user_id: string;
  name?: string;
  is_active?: boolean;
  image_url?: string | null;
};

export async function listMyNavatars(userId: string) {
  return supabase
    .from("navatars")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function getActiveNavatar(userId: string) {
  const { data, error } = await supabase
    .from("navatars")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();
  if (!data && !error) {
    const { data: first } = await supabase
      .from("navatars")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);
    return first?.[0] ?? null;
  }
  if (error) throw error;
  return data as Navatar | null;
}

export async function setActiveNavatar(userId: string, navatarId: string) {
  await supabase.from("navatars").update({ is_active: false }).eq("user_id", userId);
  return supabase
    .from("navatars")
    .update({ is_active: true })
    .eq("id", navatarId)
    .eq("user_id", userId);
}

/* ---------- Card helpers ---------- */
export type Card = {
  id?: string;
  user_id: string;
  navatar_id: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

export async function getCard(userId: string, navatarId: string) {
  const { data, error } = await supabase
    .from("navatar_cards")
    .select("*")
    .eq("user_id", userId)
    .eq("navatar_id", navatarId)
    .maybeSingle();
  if (error) throw error;
  return (data as Card) || null;
}

export async function upsertCard(card: Card) {
  const payload = { ...card, updated_at: new Date().toISOString() } as any;
  const { data, error } = await supabase
    .from("navatar_cards")
    .upsert(payload, { onConflict: "user_id,navatar_id" })
    .select()
    .single();
  if (error) throw error;
  return data as Card;
}

