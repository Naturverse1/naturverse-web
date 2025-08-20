import type { Handler } from '@netlify/functions';
import { supa } from './nv-supabase';

const DEMO_USER = 'demo-parent';

export const handler: Handler = async (event) => {
  const db = supa();

  if (event.httpMethod === 'GET') {
    const { data: props, error } = await db.from('dao_proposals').select('*').order('created_at', { ascending: false });
    if (error) return resp(500, { error: error.message });
    const withCounts = await Promise.all(
      (props ?? []).map(async p => {
        const { count: yes } = await db.from('dao_votes').select('*', { count: 'exact', head: true }).eq('proposal_id', p.id).eq('vote', true);
        const { count: no }  = await db.from('dao_votes').select('*', { count: 'exact', head: true }).eq('proposal_id', p.id).eq('vote', false);
        return { ...p, yes: yes ?? 0, no: no ?? 0 };
      })
    );
    return resp(200, withCounts);
  }

  if (event.httpMethod === 'POST') {
    const payload = JSON.parse(event.body || '{}');
    const { proposal_id, vote } = payload;
    if (!proposal_id || typeof vote !== 'boolean') return resp(400, { error: 'invalid payload' });
    const { error } = await db.from('dao_votes').upsert({ proposal_id, user_id: DEMO_USER, vote });
    if (error) return resp(500, { error: error.message });

    const res = await (await handler({ httpMethod: 'GET' } as any) as any);
    return res;
  }

  return resp(405, { error: 'method not allowed' });
};

function resp(statusCode: number, body: any) {
  return { statusCode, body: JSON.stringify(body) };
}
