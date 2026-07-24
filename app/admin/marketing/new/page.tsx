import { requireAdmin } from "@/lib/auth-helpers"
import { CouponForm } from "@/components/admin/coupon-form"

export default async function NewCouponPage() {
  await requireAdmin()
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">New Coupon</h1>
        <p className="text-charcoal-500 mt-1">Create a discount code</p>
      </div>
      <CouponForm />
    </div>
  )
}
