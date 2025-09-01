import { getSupabase } from "@/lib/supabase-client";
import { useAuth } from "@/auth/AuthContext";

export function useSession() {
  const { user } = useAuth();
  return { user };
}

export async function getUserId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}
