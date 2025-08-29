import Stripe from "stripe";
import type { Handler } from "@netlify/functions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export const handler: Handler = async (event) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Naturverse Navatar Style Kit" },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL}/success`,
      cancel_url: `${process.env.URL}/cancel`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err: any) {
    return { statusCode: 500, body: err.message };
  }
};
