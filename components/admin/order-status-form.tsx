"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function OrderStatusForm({
  orderId,
  status,
  paymentStatus,
  fulfillmentStatus,
  trackingNumber,
  carrier,
}: {
  orderId: string
  status: string
  paymentStatus: string
  fulfillmentStatus: string
  trackingNumber: string
  carrier: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState({
    status,
    paymentStatus,
    fulfillmentStatus,
    trackingNumber,
    carrier,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update order")
      toast.success("Order updated")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-charcoal-100 p-6 space-y-6">
      <h2 className="font-serif text-xl text-emerald">Update Order</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label>Status</Label>
          <select
            className="w-full h-10 border border-charcoal-200 px-3 text-sm bg-white"
            value={values.status}
            onChange={(e) => setValues({ ...values, status: e.target.value })}
          >
            {["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"].map(
              (s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              )
            )}
          </select>
        </div>
        <div>
          <Label>Payment Status</Label>
          <select
            className="w-full h-10 border border-charcoal-200 px-3 text-sm bg-white"
            value={values.paymentStatus}
            onChange={(e) => setValues({ ...values, paymentStatus: e.target.value })}
          >
            {["PENDING", "AUTHORIZED", "PAID", "PARTIALLY_REFUNDED", "REFUNDED", "FAILED"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Fulfillment</Label>
          <select
            className="w-full h-10 border border-charcoal-200 px-3 text-sm bg-white"
            value={values.fulfillmentStatus}
            onChange={(e) => setValues({ ...values, fulfillmentStatus: e.target.value })}
          >
            {["UNFULFILLED", "PARTIALLY_FULFILLED", "FULFILLED", "RETURNED"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Carrier</Label>
          <Input
            value={values.carrier}
            onChange={(e) => setValues({ ...values, carrier: e.target.value })}
            placeholder="e.g. UPS, FedEx"
          />
        </div>
        <div>
          <Label>Tracking Number</Label>
          <Input
            value={values.trackingNumber}
            onChange={(e) => setValues({ ...values, trackingNumber: e.target.value })}
          />
        </div>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Save
      </Button>
    </form>
  )
}
