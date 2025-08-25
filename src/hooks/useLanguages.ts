import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";

export function useLanguages() {
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("languages").select("*").order("name");
      if (!error) setLanguages(data || []);
      setLoading(false);
    })();
  }, []);

  async function getLessons(languageId: string) {
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
