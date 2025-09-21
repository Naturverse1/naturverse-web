import { getBrowserClient } from "@/lib/supabaseClient";

type SaveAvatarParams = {
  id?: string;
  name?: string;
  species?: string;
  kingdom?: string;
  backstory?: string;
  powers?: string[];
  traits?: string[];
};

const cleanField = (value?: string) => {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
};

const cleanList = (list?: string[]) =>
  (list ?? []).map((item) => item.trim()).filter((item) => item.length > 0);

export async function saveAvatar(
  params: SaveAvatarParams
): Promise<Record<string, any>> {
  const supabase = getBrowserClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = userData?.user;
  if (!user) {
    throw new Error("Not signed in");
  }

  const base: Record<string, any> = {
    id: params.id,
    user_id: user.id,
    name: cleanField(params.name),
    species: cleanField(params.species),
    kingdom: cleanField(params.kingdom),
    backstory: cleanField(params.backstory),
  };

  if (!base.id) {
    delete base.id;
  }

  const { data: navatarRow, error: navatarError } = await supabase
    .from("navatars")
    .upsert(base, { onConflict: "id" })
    .select()
    .single();

  if (navatarError) throw navatarError;
  if (!navatarRow?.id) {
    throw new Error("Failed to save navatar");
  }

  const cardPayload: Record<string, any> = {
    navatar_id: navatarRow.id,
    powers: cleanList(params.powers),
    traits: cleanList(params.traits),
  };

  const { data: cardRow, error: cardError } = await supabase
    .from("navatar_cards")
    .upsert(cardPayload, { onConflict: "navatar_id" })
    .select()
    .single();

  if (cardError) throw cardError;

  const normalizedNavatar = { ...navatarRow } as Record<string, any>;
  if (!("user_id" in normalizedNavatar)) {
    normalizedNavatar.user_id = user.id;
  }
  if (!("owner_id" in normalizedNavatar)) {
    normalizedNavatar.owner_id = normalizedNavatar.user_id;
  }

  return {
    ...normalizedNavatar,
    powers: (cardRow?.powers as string[] | null) ?? [],
    traits: (cardRow?.traits as string[] | null) ?? [],
  };
}
