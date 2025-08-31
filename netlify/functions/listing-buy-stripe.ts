import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

export const handler: Handler = async (event) => {
  try {
    const { listing_id, buyer_user_id } = JSON.parse(event.body || '{}');
    if (!listing_id || !buyer_user_id) return resp(400, 'Missing');

    const admin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    const { data: listing } = await admin
      .from('navatar_listings')
      .select('*')
      .eq('id', listing_id)
      .maybeSingle();
    if (!listing || listing.status !== 'active') return resp(400, 'Listing unavailable');
    if (listing.currency !== 'usd' || !listing.price_cents) return resp(400, 'Listing is not Stripe/USD');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: listing.price_cents,
            product_data: { name: `Navatar #${listing.navatar_id}` },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.SITE_URL}/marketplace/navatar?purchase=success`,
      cancel_url: `${process.env.SITE_URL}/marketplace/navatar?purchase=cancel`,
      metadata: {
        type: 'navatar_listing',
        listing_id,
        buyer_user_id,
      },
    });

    return resp(200, { url: session.url });
  } catch (e: any) {
    return resp(500, e?.message || 'Server error');
  }
};

function resp(code: number, body: any) {
  return { statusCode: code, body: typeof body === 'string' ? body : JSON.stringify(body) };
}
