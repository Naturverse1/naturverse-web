import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const handler: Handler = async (event) => {
  try {
    const sig = event.headers['stripe-signature'] as string;
    const payload = event.body as string;

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    let evt = stripe.webhooks.constructEvent(payload, sig, endpointSecret);

    if (evt.type === 'checkout.session.completed') {
      const session = evt.data.object as Stripe.Checkout.Session;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { expand: ['data.price.product'] });

      const user_id = session.metadata?.user_id || null;

      const record = {
        stripe_session_id: session.id,
        user_id,
        email: session.customer_details?.email ?? null,
        amount_total: session.amount_total ?? 0,
        currency: session.currency ?? 'usd',
        status: session.payment_status,
        line_items: lineItems.data.map(li => ({
          quantity: li.quantity,
          amount_subtotal: li.amount_subtotal,
          amount_total: li.amount_total,
          description: li.description,
          price_id: li.price?.id,
          product: (li.price?.product as any)?.name
        }))
      };

      const { error } = await supabase.from('orders').upsert(record, { onConflict: 'stripe_session_id' });
      if (error) {
        console.error('Supabase upsert error', error);
        return { statusCode: 500, body: 'Supabase error' };
      }
    }

    return { statusCode: 200, body: 'ok' };
  } catch (e: any) {
    console.error('Webhook error', e);
    return { statusCode: 400, body: `Webhook Error: ${e.message}` };
  }
};
