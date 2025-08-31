import type { Handler } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  const q = (event.queryStringParameters?.q || "").trim();
  if (!q || q === "*") {
    const { data, error } = await supabase.from("quests_index").select("id,title,summary,tags").limit(100);
    if (error) return { statusCode: 500, body: error.message };
    return { statusCode: 200, body: JSON.stringify(data) };
  }
  const { data, error } = await supabase.rpc("search_quests", { query: q });
  if (error) return { statusCode: 500, body: error.message };
  return { statusCode: 200, body: JSON.stringify(data) };
};
