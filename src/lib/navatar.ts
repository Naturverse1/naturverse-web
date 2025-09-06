import { supabase } from "./supabase-client";

export type NavatarRow = {
  user_id: string;
  name: string | null;
  image_path: string | null;
  url?: string | null;
};

export type Card = {
  name?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  powers?: string[] | null;
  traits?: string[] | null;
};

export async function getMyNavatar() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("navatars")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!data?.image_path) return data as NavatarRow | null;

  const { data: signed } = await supabase
    .storage.from("avatars")
    .createSignedUrl(data.image_path.replace(/^avatars\//, ""), 3600);
  return { ...(data as NavatarRow), url: signed?.signedUrl };
}

export async function setMyNavatar(file: File, name?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not signed in");

  const ext = file.name.split(".").pop() || "png";
  const objectPath = `${user.id}/${Date.now()}.${ext}`;

  const up = await supabase.storage.from("avatars").upload(objectPath, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });
  if (up.error) throw up.error;

  await supabase
    .from("navatars")
    .upsert(
      { user_id: user.id, name: name || null, image_path: `avatars/${objectPath}` },
      { onConflict: "user_id" }
    );

  return getMyNavatar();
}

export async function saveCard(card: Card) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("not signed in");

  return supabase
    .from("navatar_cards")
    .upsert({ user_id: user.id, ...card }, { onConflict: "user_id" });
}

export async function loadCard() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("navatar_cards")
    .select("*")
    .eq("user_id", user.id)
    .single();
  return (data as Card) || null;
}
