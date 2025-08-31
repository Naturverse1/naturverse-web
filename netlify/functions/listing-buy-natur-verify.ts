import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { ethers } from 'ethers';

const supa = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const RPC = process.env.NATUR_RPC_URL!;
const TOKEN = process.env.VITE_NATUR_TOKEN_CONTRACT!;
const TREASURY = process.env.VITE_NATUR_TREASURY!;
const DECIMALS = Number(process.env.VITE_NATUR_TOKEN_DECIMALS || '18');
const ERC20_ABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];

export const handler: Handler = async (event) => {
  try {
    const { listing_id, buyer_user_id, tx_hashes = [] } = JSON.parse(event.body || '{}');
    if (!listing_id || !buyer_user_id || !Array.isArray(tx_hashes) || tx_hashes.length === 0) return resp(400, 'Missing inputs');

    const { data: listing } = await supa
      .from('navatar_listings')
      .select('*')
      .eq('id', listing_id)
      .maybeSingle();
    if (!listing || listing.status !== 'active') return resp(400, 'Listing unavailable');
    if (listing.currency !== 'natur' || !listing.price_natur) return resp(400, 'Not a NATUR listing');

    const { data: sellerProfile } = await supa
      .from('profiles')
      .select('wallet_address')
      .eq('id', listing.seller_user_id)
      .maybeSingle();
    const { data: nav } = await supa
      .from('navatars')
      .select('created_by')
      .eq('id', listing.navatar_id)
      .maybeSingle();
    const { data: creatorProfile } = nav?.created_by
      ? await supa
          .from('profiles')
          .select('wallet_address')
          .eq('id', nav.created_by)
          .maybeSingle()
      : { data: null as any };

    const gross = Number(listing.price_natur);
    const fee = Math.round(gross * (listing.fee_bps / 10000) * 1e6) / 1e6;
    const royalty = Math.round(gross * (listing.royalty_bps / 10000) * 1e6) / 1e6;
    const seller = Math.max(0, Math.round((gross - fee - royalty) * 1e6) / 1e6);

    const provider = new ethers.JsonRpcProvider(RPC);
    const iface = new ethers.Interface(ERC20_ABI);

    let seenSeller = false;
    let seenFeeRoy = false;
    const needSellerTo = (sellerProfile?.wallet_address || '').toLowerCase();
    const needTreasury = TREASURY.toLowerCase();

    for (const h of tx_hashes) {
      const receipt = await provider.getTransactionReceipt(h);
      if (!receipt || receipt.status !== 1) continue;
      for (const log of receipt.logs) {
        if ((log.address || '').toLowerCase() !== TOKEN.toLowerCase()) continue;
        try {
          const parsed = iface.parseLog({ topics: log.topics, data: log.data });
          const to = (parsed.args[1] as string).toLowerCase();
          const val = parsed.args[2] as bigint;
          if (needSellerTo && to === needSellerTo && Number(ethers.formatUnits(val, DECIMALS)) + 1e-12 >= seller) {
            seenSeller = true;
          }
          if (to === needTreasury && Number(ethers.formatUnits(val, DECIMALS)) + 1e-12 >= (fee + (creatorProfile?.wallet_address ? 0 : royalty))) {
            seenFeeRoy = true;
          }
        } catch {}
      }
    }

    if (!(seenSeller && seenFeeRoy)) return resp(400, 'Required NATUR transfers not detected');

    await supa.from('navatar_sales').insert({
      listing_id,
      buyer_user_id,
      method: 'natur',
      gross_amount: gross,
      fee_amount: fee,
      royalty_amount: royalty,
      seller_proceeds: seller,
      tx_hashes,
    });

    await supa
      .from('owned_navatars')
      .delete()
      .eq('user_id', listing.seller_user_id)
      .eq('navatar_id', listing.navatar_id);
    await supa
      .from('owned_navatars')
      .upsert({ user_id: buyer_user_id, navatar_id: listing.navatar_id });

    await supa
      .from('navatar_listings')
      .update({ status: 'sold', sold_at: new Date().toISOString() })
      .eq('id', listing_id);

    return resp(200, { ok: true });
  } catch (e: any) {
    return resp(500, e?.message || 'Server error');
  }
};

function resp(code: number, body: any) {
  return { statusCode: code, body: typeof body === 'string' ? body : JSON.stringify(body) };
}
