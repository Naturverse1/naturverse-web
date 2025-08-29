import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' });

const PRODUCTS: Record<string, { name: string; price: number; physical: boolean }> = {
  'navatar-style-kit': { name: 'Navatar Style Kit', price: 999, physical: false },
  'breathwork-starter': { name: 'Breathwork Starter Pack', price: 900, physical: false },
  'naturverse-plushie': { name: 'Naturverse Plushie', price: 2800, physical: true },
  'naturverse-tshirt':  { name: 'Naturverse T-Shirt',  price: 2400, physical: true },
  'sticker-pack':       { name: 'Sticker Pack',        price: 1200, physical: true },
};

export const handler: Handler = async (event) => {
  try {
    const { items } = JSON.parse(event.body || '{}') as { items: { id: string; qty: number }[] };

    const line_items = (items || [])
      .map(({ id, qty }) => {
        const p = PRODUCTS[id];
        if (!p) return null;
        return {
          quantity: Math.max(1, qty || 1),
          price_data: {
            currency: 'usd',
            unit_amount: p.price,
            product_data: { name: p.name },
          },
        } as Stripe.Checkout.SessionCreateParams.LineItem;
      })
      .filter(Boolean) as Stripe.Checkout.SessionCreateParams.LineItem[];

    if (!line_items.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No valid items.' }) };
    }

    const hasPhysical = (items || []).some(i => PRODUCTS[i.id]?.physical);

    const url = event.headers.origin || 'https://thenaturverse.com';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      allow_promotion_codes: true,
      shipping_address_collection: hasPhysical ? { allowed_countries: ['US', 'CA', 'GB', 'AU'] } : undefined,
      success_url: `${url}/?checkout=success`,
      cancel_url: `${url}/?checkout=cancel`,
    });

    return { statusCode: 200, body: JSON.stringify({ id: session.id, url: session.url }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal error' }) };
  }
};
