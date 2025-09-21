import supabase from "./supabaseClient";

// keep types at top (unchanged)

const cleanField = (value?: string) => {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
};
const cleanList = (list?: string[]) =>
  (list ?? []).map((s) => s.trim()).filter(Boolean);

export type SaveAvatarParams = {
  id?: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

export async function saveAvatar(params: SaveAvatarParams) {
  const sb = supabase();

  // who’s writing?
  const { data: userData, error: userError } = await sb.auth.getUser();
  if (userError) throw userError;
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not signed in");

  // upsert avatar (owner)
  const base: Record<string, any> = {
    user_id: userId,
    name: cleanField(params.name),
    species: cleanField(params.species),
    kingdom: cleanField(params.kingdom),
    backstory: cleanField(params.backstory),
  };
  if (params.id) base.id = params.id;

  const { data: avatarRow, error: avatarErr } = await sb
    .from("navatars")
    .upsert(base, { onConflict: "id" })
    .select()
    .single();
  if (avatarErr) throw avatarErr;
  if (!avatarRow?.id) throw new Error("Failed to save avatar");

  // upsert card (powers/traits)
  const { data: cardRow, error: cardErr } = await sb
    .from("navatar_cards")
    .upsert(
      {
        navatar_id: avatarRow.id,
        powers: cleanList(params.powers),
        traits: cleanList(params.traits),
      },
      { onConflict: "navatar_id" }
    )
    .select()
    .single();
  if (cardErr) throw cardErr;

  return {
    ...avatarRow,
    powers: (cardRow?.powers as string[]) ?? [],
    traits: (cardRow?.traits as string[]) ?? [],
  };
}
