import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useLanguages() {
  const [languages, setLanguages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLanguages() {
      const { data, error } = await supabase.from("languages").select("*");
      if (error) console.error(error);
      setLanguages(data || []);
      setLoading(false);
    }
    fetchLanguages();
  }, []);

  async function getLessons(languageId: string) {
    const { data, error } = await supabase
      .from("language_lessons")
      .select("*, language_lesson_items(*)")
      .eq("language_id", languageId);

    if (error) console.error(error);
    return data || [];
  }

  return { languages, loading, getLessons };
}
