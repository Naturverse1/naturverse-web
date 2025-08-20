import { supabase } from "@/supabaseClient";

export type NavatarTraits = {
  realm: "animal" | "fruit" | "insect" | "spirit";
  species: string;
  color: string;
  eyes: "happy" | "kind" | "sleepy" | "hero";
  accessory?: "none" | "crown" | "flower" | "glasses" | "scarf";
};

export type NavatarRecord = {
  id: string;
  user_id: string;
  svg: string;
  traits: NavatarTraits;
  updated_at: string;
};

export function makeNavatarSVG(traits: NavatarTraits): string {
  // simple inline SVG avatar – deterministic from traits, CSP-safe (no eval)
  const baseFill = traits.color || "#7dd3fc";
  const eye = traits.eyes === "sleepy" ? "M2 2h4" : "M1 1h2 M5 1h2";
  const accessory =
    traits.accessory === "crown"
      ? `<path d="M6 1l2 3 2-3 2 3 2-3v2H6z" fill="#facc15"/>`
      : traits.accessory === "flower"
      ? `<circle cx="6" cy="2" r="1" fill="#f472b6"/><path d="M6 3v2" stroke="#f472b6"/>`
      : traits.accessory === "glasses"
      ? `<circle cx="5" cy="5" r="1" stroke="#111" fill="none"/><circle cx="9" cy="5" r="1" stroke="#111" fill="none"/><path d="M6 5h2" stroke="#111"/>`
      : traits.accessory === "scarf"
      ? `<path d="M4 10h6v2H4z" fill="#ef4444"/>`
      : "";

  const label = `${traits.realm} • ${traits.species}`;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="320" height="320">
  <rect x="0" y="0" width="14" height="14" rx="3" fill="${baseFill}"/>
  <circle cx="7" cy="6" r="4" fill="#fff"/>
  <path d="${eye}" stroke="#111" stroke-width="0.5" stroke-linecap="round" transform="translate(3,5)"/>
  ${accessory}
  <text x="7" y="13" font-size="1.2" text-anchor="middle" fill="#0f172a" font-family="system-ui, sans-serif">${label}</text>
</svg>`.trim();
}

export async function saveNavatar(userId: string, traits: NavatarTraits) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const svg = makeNavatarSVG(traits);
  const { data: existing, error: getErr } = await supabase
    .from("user_avatars")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (getErr) throw getErr;

  if (existing?.id) {
    const { error } = await supabase
      .from("user_avatars")
      .update({ svg, traits })
      .eq("id", existing.id);
    if (error) throw error;
    return { id: existing.id, svg, traits };
  } else {
    const { data, error } = await supabase
      .from("user_avatars")
      .insert({ user_id: userId, svg, traits })
      .select()
      .single();
    if (error) throw error;
    return data as NavatarRecord;
  }
}

export async function fetchNavatar(userId: string): Promise<NavatarRecord | null> {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from("user_avatars")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as NavatarRecord) ?? null;
}
