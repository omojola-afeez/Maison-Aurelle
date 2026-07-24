import { loadStripe, Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null>

// Module-level singleton: loadStripe() should only ever be called once per
// page load. Calling it inside the function (instead of at module scope)
// would re-fetch and re-initialize Stripe.js on every render.
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}
