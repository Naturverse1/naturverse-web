import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

async function getEthersSafe() {
  try {
    const mod = await import('ethers');
    return mod as any;
  } catch (err) {
    console.warn('[natur] ethers not available:', err);
    return null;
  }
}

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const RPC = process.env.NATUR_RPC_URL!;
const TOKEN = process.env.VITE_NATUR_TOKEN_CONTRACT!;
const TREASURY = process.env.VITE_NATUR_TREASURY!;
const DECIMALS = Number(process.env.VITE_NATUR_TOKEN_DECIMALS || '18');

const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

export const handler: Handler = async (event) => {
  try {
    const { txHash, navatar_id, amount_natur } = JSON.parse(event.body || '{}');
    if (!txHash || !navatar_id) return resp(400, { error: 'Missing txHash/navatar_id' });

    const ethers = await getEthersSafe();
    if (!ethers) return resp(500, { error: 'ethers not available' });
    const provider = new ethers.JsonRpcProvider(RPC);
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || receipt.status !== 1) return resp(400, { error: 'Transaction not confirmed' });

    // Verify an ERC20 Transfer(TOKEN) -> TREASURY with value >= expected
    const iface = new ethers.Interface(ERC20_ABI);
    const expected = ethers.parseUnits(String(amount_natur || 0), DECIMALS);

    let ok = false;
    let from: string | null = null;

    for (const log of receipt.logs) {
      if ((log.address || '').toLowerCase() !== TOKEN.toLowerCase()) continue;
      try {
        const parsed = iface.parseLog({ topics: log.topics, data: log.data });
        const to = (parsed.args[1] as string).toLowerCase();
        const val = parsed.args[2] as bigint;
        if (to === TREASURY.toLowerCase() && val >= expected) {
          from = (parsed.args[0] as string);
          ok = true;
          break;
        }
      } catch {}
    }

    if (!ok) return resp(400, { error: 'No matching $NATUR transfer to treasury' });

    // If you have user auth on the client, you may include a supabase JWT in headers.
    // Here we trust chain + link ownership to wallet address (store it).
    // Upsert purchase + ownership. You can also map wallet->user_id on your profile table.
    await supa.from('navatar_purchases').insert({
      user_id: null, // optional: map via wallet table if you have it
      navatar_id,
      method: 'natur',
      amount: amount_natur || 0
    });

    // If you tie wallet to user account, also:
    // await supa.from('owned_navatars').insert({ user_id, navatar_id }).onConflict('user_id,navatar_id').ignore();

    return resp(200, { ok: true, from });
  } catch (e: any) {
    return resp(500, { error: e?.message || 'Server error' });
  }
};

function resp(code: number, body: any) {
  return { statusCode: code, body: JSON.stringify(body) };
}
