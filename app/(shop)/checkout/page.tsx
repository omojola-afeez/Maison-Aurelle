"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Elements } from "@stripe/react-stripe-js"
import { useCartStore } from "@/stores/cart-store"
import { formatPrice } from "@/lib/utils"
import { getStripe } from "@/lib/stripe-client"
import { CheckoutPaymentForm } from "@/components/checkout/payment-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"
import { ChevronRight } from "lucide-react"

const steps = ["Information", "Shipping", "Payment"]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
    shippingMethod: "standard",
  })

  const shippingCost = subtotal() > 500 ? 0 : 25
  const tax = (subtotal() + shippingCost) * 0.08
  const total = subtotal() + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="luxury-container py-16 text-center">
        <h1 className="font-serif text-3xl text-emerald mb-4">Your bag is empty</h1>
        <p className="text-charcoal-500 mb-8">Add some items to proceed to checkout.</p>
        <Button onClick={() => router.push("/")}>Continue Shopping</Button>
      </div>
    )
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = async () => {
    if (currentStep === 0) {
      if (!formData.email || !formData.name || !formData.line1 || !formData.city || !formData.state || !formData.zip) {
        toast.error("Please fill in all required fields")
        return
      }
      setCurrentStep(1)
      return
    }

    if (currentStep === 1) {
      // Moving from Shipping into Payment: create the order and the
      // Stripe PaymentIntent up front, so the Payment step can mount
      // Stripe Elements against a real clientSecret.
      setIsCreatingOrder(true)
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((item) => ({
              name: item.name,
              sku: item.sku,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            shippingAddress: {
              email: formData.email,
              name: formData.name,
              line1: formData.line1,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              country: formData.country,
              phone: formData.phone,
            },
          }),
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.error || "Failed to start checkout")
        }

        setOrderId(data.orderId)
        setClientSecret(data.clientSecret)
        setCurrentStep(2)
      } catch (error: any) {
        toast.error(error.message || "Something went wrong")
      } finally {
        setIsCreatingOrder(false)
      }
    }
  }

  const handlePaymentSuccess = () => {
    clearCart()
    if (orderId) {
      router.push(`/checkout/confirmation/${orderId}`)
    }
  }

  return (
    <div className="luxury-container py-8 md:py-16">
      <h1 className="font-serif text-3xl text-emerald mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-12">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-4">
            <div
              className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? "bg-emerald text-white"
                  : "bg-charcoal-100 text-charcoal-400"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`text-sm ${
                index <= currentStep ? "text-charcoal" : "text-charcoal-400"
              }`}
            >
              {step}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-charcoal-300" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-2">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="mt-2"
                  />
                </div>
              </div>

              <h2 className="font-serif text-xl text-emerald pt-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    value={formData.line1}
                    onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                    placeholder="123 Main Street"
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="line2">Address Line 2 (optional)</Label>
                  <Input
                    id="line2"
                    value={formData.line2}
                    onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                    placeholder="Apt 4B"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="New York"
                    className="mt-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="NY"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      placeholder="10001"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Shipping Method</h2>
              <div className="space-y-4">
                <label
                  className={`flex items-center justify-between p-6 border-2 cursor-pointer transition-colors ${
                    formData.shippingMethod === "standard"
                      ? "border-emerald bg-emerald/5"
                      : "border-charcoal-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      value="standard"
                      checked={formData.shippingMethod === "standard"}
                      onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                      className="accent-emerald"
                    />
                    <div>
                      <p className="font-medium">Standard Shipping</p>
                      <p className="text-sm text-charcoal-500">5-7 business days</p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-6 border-2 cursor-pointer transition-colors ${
                    formData.shippingMethod === "express"
                      ? "border-emerald bg-emerald/5"
                      : "border-charcoal-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="radio"
                      name="shipping"
                      value="express"
                      checked={formData.shippingMethod === "express"}
                      onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                      className="accent-emerald"
                    />
                    <div>
                      <p className="font-medium">Express Shipping</p>
                      <p className="text-sm text-charcoal-500">2-3 business days</p>
                    </div>
                  </div>
                  <span className="font-medium">{formatPrice(45)}</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && clientSecret && (
            <div className="space-y-6">
              <h2 className="font-serif text-xl text-emerald">Payment</h2>
              <Elements
                stripe={getStripe()}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
              >
                <CheckoutPaymentForm
                  returnUrl={`${window.location.origin}/checkout/confirmation/${orderId}`}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </div>
          )}

          {currentStep < 2 && (
            <div className="flex items-center justify-between mt-8 pt-8 border-t border-charcoal-100">
              {currentStep > 0 ? (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div />
              )}
              <Button onClick={handleNext} isLoading={isCreatingOrder}>
                Continue
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-8 pt-8 border-t border-charcoal-100">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-ivory-100 p-6 h-fit">
          <h2 className="font-serif text-xl text-emerald mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-20 bg-white border border-charcoal-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-charcoal-400">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-6" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal-500">Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Shipping</span>
              <span>{shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-500">Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="flex justify-between text-lg font-medium">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
