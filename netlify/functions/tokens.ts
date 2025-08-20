import type { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // secure on server
const supabase = createClient(url, key, { auth: { persistSession:false }});

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === 'GET') {
      const device = (event.queryStringParameters?.device)||'';
      const { data } = await supabase.from('user_tokens').select('balance').eq('device_id', device).maybeSingle();
      return resp({ balance: data?.balance ?? 0 });
    }
    if (event.httpMethod === 'POST') {
      const { device, amount, op } = JSON.parse(event.body||'{}');
      if (op === 'add') {
        await supabase.rpc('add_tokens', { p_device: device, p_amount: amount || 0 }).catch(async ()=>{
          // fallback if rpc not defined
          await supabase.from('user_tokens')
            .upsert({ device_id: device, balance: 0 }, { onConflict: 'device_id' });
          await supabase.rpc('noop');
        });
        await supabase.from('user_tokens')
          .upsert({ device_id: device, balance: (amount||0) }, { onConflict: 'device_id', ignoreDuplicates: true });
        await supabase.rpc('increment_balance', { p_device: device, p_amount: amount||0 }).catch(async ()=>{
          await supabase.from('user_tokens')
            .update({ balance: supabase.rpc as any }).eq('device_id', device);
        });
      }
      return resp({ ok:true });
    }
    return resp({ error:'method' }, 405);
  } catch (e:any){ return resp({ error:e.message }, 500); }
};

function resp(body:any, status=200){ return { statusCode: status, body: JSON.stringify(body) }; }
