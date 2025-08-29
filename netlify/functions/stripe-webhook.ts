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
      const { user_id, navatar_id } = session.metadata;
      await supabase.from('navatar_purchases').insert([
        {
          user_id,
          navatar_id,
          method: 'stripe',
          amount: session.amount_total / 100,
        },
      ]);
      // auto-mark navatar as owned
      await supabase.from('profiles').update({ navatar_id }).eq('id', user_id);
    }
    return { statusCode: 200, body: 'ok' };
  } catch (e) {
    return { statusCode: 400, body: `Webhook error: ${e}` };
  }
};
