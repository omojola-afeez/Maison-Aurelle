"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Lock, CreditCard } from "lucide-react"

export function CheckoutPaymentForm({
  returnUrl,
  onSuccess,
}: {
  returnUrl: string
  onSuccess: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsLoading(true)
    setError("")

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || "Please check your payment details")
      setIsLoading(false)
      return
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
      redirect: "if_required",
    })

    if (confirmError) {
      setError(confirmError.message || "Payment failed. Please try again.")
      setIsLoading(false)
      return
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess()
      return
    }

    // Any other outcome (e.g. still processing, or Stripe is about to
    // redirect for 3D Secure) falls through here; if a redirect was
    // required, the browser will already be navigating away.
    setIsLoading(false)
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <div className="p-6 border border-charcoal-200 bg-ivory-50">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-emerald" />
          <p className="font-medium">Secure Payment</p>
        </div>
        <p className="text-sm text-charcoal-500">
          Your payment information is encrypted and processed by Stripe. We never see or store your card details.
        </p>
      </div>

      <PaymentElement />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
      )}

      <Button type="submit" isLoading={isLoading} disabled={!stripe || !elements} className="w-full">
        <CreditCard className="w-4 h-4 mr-2" />
        Complete Order
      </Button>
    </form>
  )
}
