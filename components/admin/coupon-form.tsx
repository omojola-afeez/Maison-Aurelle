"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CouponFormValues {
  id?: string
  code: string
  type: "percentage" | "fixed_amount"
  value: number
  minOrder: number | null
  maxDiscount: number | null
  usageLimit: number | null
  expiresAt: string
  isActive: boolean
}

export function CouponForm({ initialValues }: { initialValues?: CouponFormValues }) {
  const router = useRouter()
  const isEdit = Boolean(initialValues?.id)
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState<CouponFormValues>(
    initialValues ?? {
      code: "",
      type: "percentage",
      value: 10,
      minOrder: null,
      maxDiscount: null,
      usageLimit: null,
      expiresAt: "",
      isActive: true,
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const url = isEdit ? `/api/admin/coupons/${initialValues!.id}` : "/api/admin/coupons"
      const method = isEdit ? "PATCH" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Something went wrong")

      toast.success(isEdit ? "Coupon updated" : "Coupon created")
      router.push("/admin/marketing")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-charcoal-100 p-8 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Code</Label>
          <Input
            required
            disabled={isEdit}
            value={values.code}
            onChange={(e) => setValues({ ...values, code: e.target.value.toUpperCase() })}
            placeholder="e.g. WELCOME10"
          />
        </div>
        <div>
          <Label>Type</Label>
          <select
            className="w-full h-10 border border-charcoal-200 px-3 text-sm bg-white"
            value={values.type}
            onChange={(e) => setValues({ ...values, type: e.target.value as "percentage" | "fixed_amount" })}
          >
            <option value="percentage">Percentage off</option>
            <option value="fixed_amount">Fixed amount off</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label>{values.type === "percentage" ? "Percent Off" : "Amount Off ($)"}</Label>
          <Input
            required
            type="number"
            step="0.01"
            min="0"
            value={values.value}
            onChange={(e) => setValues({ ...values, value: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label>Minimum Order ($)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={values.minOrder ?? ""}
            onChange={(e) => setValues({ ...values, minOrder: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>
        <div>
          <Label>Max Discount ($)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={values.maxDiscount ?? ""}
            onChange={(e) => setValues({ ...values, maxDiscount: e.target.value ? parseFloat(e.target.value) : null })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Usage Limit</Label>
          <Input
            type="number"
            min="0"
            value={values.usageLimit ?? ""}
            onChange={(e) => setValues({ ...values, usageLimit: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="Leave blank for unlimited"
          />
        </div>
        <div>
          <Label>Expires</Label>
          <Input
            type="date"
            value={values.expiresAt}
            onChange={(e) => setValues({ ...values, expiresAt: e.target.value })}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="w-4 h-4 accent-emerald"
          checked={values.isActive}
          onChange={(e) => setValues({ ...values, isActive: e.target.checked })}
        />
        Active
      </label>

      <div className="flex items-center gap-4 pt-4 border-t border-charcoal-100">
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? "Save Changes" : "Create Coupon"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/marketing")}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
