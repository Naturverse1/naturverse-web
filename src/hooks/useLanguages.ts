import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/useSupabase";

export function useLanguages() {
  const supabase = useSupabase();
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (supabase) {
        const { data, error } = await supabase.from("languages").select("*").order("name");
        if (!error) setLanguages(data || []);
      }
      setLoading(false);
    })();
  }, [supabase]);

  async function getLessons(languageId: string) {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("language_lessons")
      .select("*, language_lesson_items(*)")
      .eq("language_id", languageId)
      .order("order_index", { ascending: true });
    if (error) return [];
    return data || [];
  }

  return { languages, loading, getLessons };
}
