import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth-helpers"
import prisma from "@/lib/prisma"
import { CouponForm } from "@/components/admin/coupon-form"

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const coupon = await prisma.coupon.findUnique({ where: { id: params.id } })
  if (!coupon) notFound()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-emerald">Edit Coupon</h1>
        <p className="text-charcoal-500 mt-1">{coupon.code}</p>
      </div>
      <CouponForm
        initialValues={{
          id: coupon.id,
          code: coupon.code,
          type: coupon.type as "percentage" | "fixed_amount",
          value: Number(coupon.value),
          minOrder: coupon.minOrder ? Number(coupon.minOrder) : null,
          maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
          usageLimit: coupon.usageLimit,
          expiresAt: coupon.expiresAt ? coupon.expiresAt.toISOString().slice(0, 10) : "",
          isActive: coupon.isActive,
        }}
      />
    </div>
  )
}
