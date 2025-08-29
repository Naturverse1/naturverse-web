import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });
const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  try {
    const evt = stripe.webhooks.constructEvent(event.body!, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object as any;
      if (session.metadata?.type === 'navatar_listing') {
        const listing_id = session.metadata.listing_id;
        const buyer_user_id = session.metadata.buyer_user_id;
        const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

        const { data: listing } = await admin
          .from('navatar_listings')
          .select('*')
          .eq('id', listing_id)
          .maybeSingle();
        if (listing && listing.status === 'active') {
          const gross = Number(session.amount_total) / 100;
          const fee = Math.round(gross * (listing.fee_bps / 10000) * 100) / 100;
          const royalty = Math.round(gross * (listing.royalty_bps / 10000) * 100) / 100;
          const seller = Math.max(0, Math.round((gross - fee - royalty) * 100) / 100);

          await admin.from('navatar_sales').insert({
            listing_id,
            buyer_user_id,
            method: 'stripe',
            gross_amount: gross,
            fee_amount: fee,
            royalty_amount: royalty,
            seller_proceeds: seller,
            tx_hashes: [],
          });

          await admin
            .from('owned_navatars')
            .delete()
            .eq('user_id', listing.seller_user_id)
            .eq('navatar_id', listing.navatar_id);
          await admin
            .from('owned_navatars')
            .upsert({ user_id: buyer_user_id, navatar_id: listing.navatar_id });

          await admin
            .from('navatar_listings')
            .update({ status: 'sold', sold_at: new Date().toISOString() })
            .eq('id', listing_id);
        }
      } else {
        const { user_id, navatar_id } = session.metadata;
        await supabase.from('navatar_purchases').insert([
          {
            user_id,
            navatar_id,
            method: 'stripe',
            amount: session.amount_total / 100,
          },
        ]);
        await supabase.from('profiles').update({ navatar_id }).eq('id', user_id);
      }
    }
    return { statusCode: 200, body: 'ok' };
  } catch (e) {
    return { statusCode: 400, body: `Webhook error: ${e}` };
  }
};
