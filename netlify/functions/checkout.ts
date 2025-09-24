import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const secret = process.env.STRIPE_SECRET_KEY;
const priceMap = JSON.parse(process.env.VITE_STRIPE_PRICE_MAP || '{}');
const successUrl = process.env.VITE_CHECKOUT_SUCCESS_URL || '/marketplace?checkout=success';
const cancelUrl = process.env.VITE_CHECKOUT_CANCEL_URL || '/marketplace?checkout=cancel';

export const handler: Handler = async (event) => {
  if (!secret) {
    return { statusCode: 501, body: 'Checkout disabled (no STRIPE_SECRET_KEY)' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });
    const { items } = JSON.parse(event.body || '{}') as {
      items: { slug: string; qty: number }[];
    };
    if (!items?.length) {
      return { statusCode: 400, body: 'No items' };
    }

    const line_items = items.map((item) => {
      const price = priceMap[item.slug];
      if (!price) {
        throw new Error(`Missing price for slug: ${item.slug}`);
      }
      return { price, quantity: Math.max(1, item.qty | 0) };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (error: any) {
    return { statusCode: 500, body: error?.message || 'Checkout error' };
  }
};
