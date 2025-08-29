import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

type CartItem =
  | { price: string; quantity?: number; metadata?: Record<string, string> }
  | {
      price_data: {
        currency: string;
        unit_amount: number;
        product_data: { name: string; description?: string };
      };
      quantity?: number;
      metadata?: Record<string, string>;
    };

type CreateSessionBody = {
  items: CartItem[];
  customer_email?: string;
  mode?: "payment" | "subscription";
  allow_promotion_codes?: boolean;
  coupon?: string;
  metadata?: Record<string, string>;
  success_url?: string;
  cancel_url?: string;
};

export async function handler(event: any) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    if (!body.items?.length) {
      return { statusCode: 400, body: "Missing items[]" };
    }

    const line_items = body.items.map((it: CartItem) => {
      if ("price" in it) {
        return { price: it.price, quantity: it.quantity || 1, metadata: it.metadata };
      }
      return {
        price_data: it.price_data,
        quantity: it.quantity || 1,
        metadata: it.metadata,
      };
    });

    const site = process.env.SITE_URL || process.env.URL || "http://localhost:8888";
    const success_url = body.success_url || `${site}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = body.cancel_url || `${site}/cancel`;

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: body.mode || "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: body.allow_promotion_codes ?? true,
      line_items,
      customer_email: body.customer_email,
      success_url,
      cancel_url,
      metadata: body.metadata,
      expand: ["line_items", "payment_intent"],
    };
    if (body.coupon) {
      (params.discounts = [{ coupon: body.coupon }]);
    }
    const session = await stripe.checkout.sessions.create(params);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err: any) {
    console.error(err);
    return { statusCode: 500, body: err.message || "Server error" };
  }
}
