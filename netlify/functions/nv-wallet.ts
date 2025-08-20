import type { Handler } from '@netlify/functions';
import { supa } from './nv-supabase';

const DEMO_USER = 'demo-parent';

export const handler: Handler = async (event) => {
  const db = supa();

  if (event.httpMethod === 'GET') {
    const { data, error } = await db
      .from('natur_wallets')
      .select('*')
      .eq('user_id', DEMO_USER)
      .maybeSingle();
    if (error) return resp(500, { error: error.message });
    if (!data) {
      const ins = await db.from('natur_wallets').insert({ user_id: DEMO_USER, balance: 120 }).select().single();
      if (ins.error) return resp(500, { error: ins.error.message });
      return resp(200, ins.data);
    }
    return resp(200, data);
  }

  return resp(405, { error: 'method not allowed' });
};

function resp(statusCode: number, body: any) {
  return { statusCode, body: JSON.stringify(body) };
}
