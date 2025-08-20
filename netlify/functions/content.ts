import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

export const handler: Handler = async (e) => {
  const type = e.queryStringParameters?.type || 'story';
  const { data, error } = await supabase.from('content').select('*').eq('type', type).limit(50);
  if(error) return { statusCode:500, body: JSON.stringify({error:error.message}) };
  return { statusCode:200, body: JSON.stringify(data) };
};
