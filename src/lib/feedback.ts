import { supabase } from '@/lib/supabase-client';

/** Submit general app/lesson feedback */
export async function submitFeedback(input: {
  user_id?: string | null;
  category: 'bug' | 'idea' | 'content' | 'other';
  message: string;
  page_path?: string | null;
  meta?: unknown; // optional JSON payload
}) {
  const { data, error } = await supabase
    .from('feedback')
    .insert({
      user_id: input.user_id ?? null,
      category: input.category,
      message: input.message,
      page_path: input.page_path ?? null,
      meta: input.meta ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** List feedback for a user (or all if no userId provided and RLS allows) */
export async function listFeedback(opts?: { userId?: string }) {
  const q = supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });
  const { data, error } = opts?.userId ? await q.eq('user_id', opts.userId) : await q;
  if (error) throw error;
  return data;
}
