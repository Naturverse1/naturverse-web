import { getSupabase } from './supabase';

export async function generateNavatar(opts: {
  prompt: string;
  sourceImageUrl?: string;
  maskImageUrl?: string;
  name?: string;
}) {
  const supabase = getSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/.netlify/functions/generateNavatar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: session?.access_token ? `Bearer ${session.access_token}` : ''
    },
    body: JSON.stringify(opts)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{ image_url: string; id: string }>;
}
