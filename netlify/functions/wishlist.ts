import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (e) => {
  if(e.httpMethod!=='POST') return res({error:'method'},405);
  const { device, type, id } = JSON.parse(e.body||'{}');
  await s.from('wishlists').upsert({ device_id: device, thing_type: type, thing_id: id }, { onConflict:'device_id,thing_type,thing_id' });
  return res({ ok:true });
};
const res = (b:any, status=200)=>({statusCode:status,body:JSON.stringify(b)});
