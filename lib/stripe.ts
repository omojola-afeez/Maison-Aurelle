import Stripe from "stripe"
import { loadStripe } from "@stripe/stripe-js"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
})

export const getStripe = () => {
  let stripePromise: Promise<Stripe | null>

  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }

  return stripePromise
}

export const createPaymentIntent = async ({
  amount,
  currency = "usd",
  metadata = {},
}: {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  })

  return paymentIntent
}
