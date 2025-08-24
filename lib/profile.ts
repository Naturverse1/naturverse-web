import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export async function getNavatarUrl(userId: string): Promise<string | null> {
  const supabase = createClientComponentClient();
  // assumes table `profiles` with column `navatar_url`
  const { data, error } = await supabase
    .from("profiles")
    .select("navatar_url")
    .eq("id", userId)
    .single();
  if (error || !data?.navatar_url) return null;
  return data.navatar_url as string;
}
