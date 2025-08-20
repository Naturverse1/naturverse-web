import type { Handler } from '@netlify/functions';
import { supa } from './nv-supabase';

export const handler: Handler = async (event) => {
  const db = supa();

  if (event.httpMethod === 'GET') {
    const { data, error } = await db
      .from('student_progress')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return resp(500, { error: error.message });
    return resp(200, data);
  }

  if (event.httpMethod === 'POST') {
    const payload = JSON.parse(event.body || '{}');
    const { student_id, quiz_id, score } = payload;
    if (!student_id || !quiz_id || typeof score !== 'number') return resp(400, { error: 'invalid payload' });
    const { data, error } = await db.from('student_progress').insert({ student_id, quiz_id, score }).select();
    if (error) return resp(500, { error: error.message });
    return resp(200, data?.[0] ?? null);
  }

  return resp(405, { error: 'method not allowed' });
};

function resp(statusCode: number, body: any) {
  return { statusCode, body: JSON.stringify(body) };
}
