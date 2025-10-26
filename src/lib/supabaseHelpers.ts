import { supabase } from '@/lib/supabaseClient';

type SaveNavatarParams = {
  id?: string;
  name?: string | null;
  species?: string | null;
  kingdom?: string | null;
  backstory?: string | null;
  powers?: string[];
  traits?: string[];
  image_url?: string | null;
  image_path?: string | null;
};

const cleanField = (value?: string | null) => {
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

  const base: Record<string, any> = {
    owner_id: userId,
  };

  if (params.id) {
    base.id = params.id;
  }

  if (params.name !== undefined) {
    base.name = cleanField(params.name);
  }

  if (params.species !== undefined) {
    base.species = cleanField(params.species);
  }

  if (params.kingdom !== undefined) {
    base.kingdom = cleanField(params.kingdom);
  }

  if (params.backstory !== undefined) {
    base.backstory = cleanField(params.backstory);
  }

  if (params.image_url !== undefined) {
    base.image_url = cleanField(params.image_url);
  }

  if (params.image_path !== undefined) {
    base.image_path = cleanField(params.image_path);
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

  let cardRow: any = null;
  const shouldUpdateCard = params.powers !== undefined || params.traits !== undefined;

  if (shouldUpdateCard) {
    const { data, error } = await supabase
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

    if (error) throw error;
    cardRow = data;
  } else {
    const { data, error } = await supabase
      .from("navatar_cards")
      .select()
      .eq("navatar_id", navatarRow.id)
      .maybeSingle();

    if (error && (error as any).code !== "PGRST116") throw error;
    cardRow = data;
  }
  return {
    ...navatarRow,
    powers: (cardRow?.powers as string[] | null) ?? [],
    traits: (cardRow?.traits as string[] | null) ?? [],
  };
}
