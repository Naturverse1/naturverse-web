import type { Handler } from '@netlify/functions';
import { supa } from './nv-supabase';

const DEFAULT_CHILD = 'demo-child';

export const handler: Handler = async (event) => {
  const db = supa();

  if (event.httpMethod === 'GET') {
    const { data, error } = await db
      .from('parent_controls')
      .select('*')
      .eq('child_id', DEFAULT_CHILD)
      .maybeSingle();
    if (error) return resp(500, { error: error.message });
    if (!data) {
      const ins = await db.from('parent_controls').insert({ child_id: DEFAULT_CHILD, content_locked: false, spending_limit: 0 }).select().single();
      if (ins.error) return resp(500, { error: ins.error.message });
      return resp(200, ins.data);
    }
    return resp(200, data);
  }

  if (event.httpMethod === 'POST') {
    const payload = JSON.parse(event.body || '{}');
    const { content_locked = false, spending_limit = 0 } = payload;
    const { data, error } = await db
      .from('parent_controls')
      .upsert({ child_id: DEFAULT_CHILD, content_locked, spending_limit })
      .select().single();
    if (error) return resp(500, { error: error.message });
    return resp(200, data);
  }

  return resp(405, { error: 'method not allowed' });
};

function resp(statusCode: number, body: any) {
  return { statusCode, body: JSON.stringify(body) };
}
