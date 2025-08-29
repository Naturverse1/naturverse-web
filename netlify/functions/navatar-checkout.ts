import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });
const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const handler: Handler = async (event) => {
  try {
    const { user_id, navatar_id, method } = JSON.parse(event.body || '{}');
    if (!user_id || !navatar_id || !method) return { statusCode: 400, body: 'Missing params' };

    if (method === 'stripe') {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price_data: {
          currency: 'usd',
          unit_amount: 499, // $4.99 for premium Navatar
          product_data: { name: `Navatar: ${navatar_id}` }
        }, quantity: 1 }],
        success_url: `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL}/marketplace/navatar?success=true`,
        cancel_url: `${process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL}/marketplace/navatar?canceled=true`,
        metadata: { user_id, navatar_id }
      });
      return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
    }

    if (method === 'natur') {
      // $NATUR: call contract via RPC (pseudo, to be expanded)
      // Save a pending purchase
      await supabase.from('navatar_purchases').insert([{ user_id, navatar_id, method: 'natur', amount: 100 }]);
      return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'NATUR payment flow placeholder' }) };
    }

    return { statusCode: 400, body: 'Invalid method' };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: String(e) }) };
  }
};
