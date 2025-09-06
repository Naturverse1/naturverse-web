import { supabase } from "@/lib/supabase-client";
import { useAuthUser } from "./useAuthUser";

export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// lightweight wrapper used by Navatar flows
export function useSession() {
  return useAuthUser();
}
