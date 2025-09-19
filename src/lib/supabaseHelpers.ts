import { supabase } from '@/lib/supabaseClient';

type SaveNavatarParams = {
  id?: string;
  name: string;
  species: string;
  kingdom: string;
  backstory: string;
  powers?: string[];
  traits?: string[];
};

const cleanField = (value?: string) => {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : null;
};

const cleanList = (list?: string[]) => (list ?? []).map((item) => item.trim()).filter((item) => item.length > 0);

export async function saveNavatar(params: SaveNavatarParams) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  const userId = userData?.user?.id;
  if (!userId) {
    throw new Error("Not signed in");
  }

  const base = {
    owner_id: userId,
    name: cleanField(params.name),
    species: cleanField(params.species),
    kingdom: cleanField(params.kingdom),
    backstory: cleanField(params.backstory),
  } as Record<string, any>;

  if (params.id) {
    base.id = params.id;
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

  const { data: cardRow, error: cardError } = await supabase
    .from("navatar_cards")
    .upsert(
      {
        navatar_id: navatarRow.id,
        powers: cleanList(params.powers),
        traits: cleanList(params.traits),
      },
      { onConflict: "navatar_id" }
    )
    .select()
    .single();

  if (cardError) throw cardError;
  return {
    ...navatarRow,
    powers: (cardRow?.powers as string[] | null) ?? [],
    traits: (cardRow?.traits as string[] | null) ?? [],
  };
}
