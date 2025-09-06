import { useMemo } from "react";
import { supabase } from "./supabase-client";

export function useSupabase() {
  return useMemo(() => supabase, []);
}
