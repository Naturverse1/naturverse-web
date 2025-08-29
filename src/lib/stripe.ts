import { loadStripe, Stripe } from '@stripe/stripe-js';
import { STRIPE_PK } from './env';

export const stripePromise: Promise<Stripe | null> =
  STRIPE_PK ? loadStripe(STRIPE_PK) : Promise.resolve(null);
