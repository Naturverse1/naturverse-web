import { supabase } from "../lib/supabase";

const LS_KEY = "nv.activeNavId";

export type Navatar = {
  id: string;
  user_id: string;
  name: string | null;
  image_url: string | null;
  base_type: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CharacterCard = {
  id?: string;
  user_id?: string;
  avatar_id: string;
  name?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  powers?: string[] | null;
  traits?: string[] | null;
  created_at?: string;
  updated_at?: string;
};

// Legacy Navatar row used by older routes
export type NavatarRow = {
  id: string;
  user_id: string;
  name: string | null;
  base_type: string;
  backstory: string | null;
  image_path: string | null;
  created_at: string;
  updated_at: string;
};

export function loadActiveId(): string | null {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v && v !== "undefined" ? v : null;
  } catch {
    return null;
  }
}

export function saveActiveId(id: string) {
  localStorage.setItem(LS_KEY, id);
}

export function clearActiveId() {
  localStorage.removeItem(LS_KEY);
}

export async function fetchActiveNavatar(): Promise<Navatar | null> {
  const id = loadActiveId();
  if (!id) return null;
  const { data, error } = await supabase
    .from("avatars") // Supabase schema uses `avatars` (not `navatars`)
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Navatar;
}

export async function pickNavatar(avatarId: string): Promise<Navatar> {
  // Verify ownership and existence, then set active.
  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("id", avatarId)
    .single();
  if (error) throw error;
  saveActiveId(avatarId);
  return data as Navatar;
}

export async function uploadNavatar(file: File, name?: string): Promise<Navatar> {
  // 10MB, image only.
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Max file size is 10MB.");
  }

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) throw userErr ?? new Error("Not authenticated.");

  const ext = file.name.split(".").pop() || "jpg";
  const key = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const upload = await supabase.storage.from("avatars").upload(key, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false,
  });
  if (upload.error) throw upload.error;

  const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(key);
  const image_url = urlData.publicUrl;

  const { data, error } = await supabase
    .from("avatars")
    .insert({
      user_id: user.id,
      name: name || file.name.replace(/\.[^.]+$/, ""),
      image_url,
      base_type: "upload",
    })
    .select("*")
    .single();

  if (error) throw error;

  saveActiveId(data.id);
  return data as Navatar;
}

export async function fetchMyCharacterCard(): Promise<CharacterCard | null> {
  const avatar_id = loadActiveId();
  if (!avatar_id) return null;

  const { data, error } = await supabase
    .from("character_cards")
    .select("*")
    .eq("avatar_id", avatar_id)
    .maybeSingle();

  if (error) throw error;
  return (data ?? null) as CharacterCard | null;
}

export async function saveCharacterCard(input: Omit<CharacterCard, "user_id">) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Please sign in.");
  if (!input.avatar_id) throw new Error("Please pick or upload a Navatar first.");

  // Upsert on (user_id, avatar_id)
  const payload = {
    ...input,
    user_id: auth.user.id,
  };

  const { data, error } = await supabase
    .from("character_cards")
    .upsert(payload, {
      onConflict: "user_id,avatar_id",
      ignoreDuplicates: false,
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as CharacterCard;
}

// --- Legacy helpers kept for older routes ---
export function navatarImageUrl(image_path: string | null) {
  if (!image_path) return null;
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

