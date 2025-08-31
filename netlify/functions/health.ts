import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { okJson, err, maybeGet, mustGet } from "./_env";

export const handler: Handler = async () => {
  try {
    const url = mustGet("SUPABASE_URL");
    const key = mustGet("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(url, key);

    // Tiny query to validate DB connectivity; lightweight table is fine
    const { error } = await supabase.from("user_streaks").select("user_id").limit(1);
    if (error) throw error;

    return okJson({
      status: "ok",
      env: {
        SUPABASE_URL: !!maybeGet("SUPABASE_URL"),
        SUPABASE_SERVICE_ROLE_KEY: !!maybeGet("SUPABASE_SERVICE_ROLE_KEY")
      }
    }, { "cache-control": "no-store" });
  } catch (e:any) {
    return err(500, `health fail: ${e.message || e}`);
  }
};
